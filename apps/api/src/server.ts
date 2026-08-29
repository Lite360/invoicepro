import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import jwt from '@fastify/jwt';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { prisma } from './prisma';
import { renderDocumentHTML } from './pdfTemplate';

const app = Fastify({ logger: true });

import { put } from '@vercel/blob';

// Ensure uploads folder exists (fallback for local development if needed)
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!process.env.VERCEL && !fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

async function main() {
    await app.register(cors, { origin: '*' });
    await app.register(multipart, {
        limits: {
            fileSize: 10 * 1024 * 1024
        }
    });
    await app.register(jwt, {
        secret: process.env.JWT_SECRET || 'invoicepro_super_secret_key_change_in_production'
    });

    if (!process.env.VERCEL) {
        await app.register(fastifyStatic, {
            root: uploadsDir,
            prefix: '/uploads/'
        });
    }



    // ── Auth Routes ──────────────────────────────────────────────────

    // POST /api/auth/signup
    app.post('/api/auth/signup', async (req, reply) => {
        const { name, email, password } = req.body as {
            name: string;
            email: string;
            password: string
        };

        if (!name || !email || !password) {
            return reply.status(400).send({ error: 'Name, email and password are required.' });
        }
        if (password.length < 6) {
            return reply.status(400).send({ error: 'Password must be at least 6 characters.' });
        }

        const existing = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (existing) {
            return reply.status(409).send({ error: 'An account with that email already exists.' });
        }

        const hashed = await bcrypt.hash(password, 12);
        let role = 'USER';
        if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL) {
            role = 'ADMIN';
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
                ...(role === 'ADMIN' ? { role: 'ADMIN' } : {})
            }
        });

        const company = await prisma.company.findUnique({ where: { userId: user.id } });
        const invoiceNumber = await generateDocNumber(company?.invoicePrefix || 'INV', 'invoice', user.id);
        
        const createdInvoice = await prisma.invoice.create({
            data: {
                userId: user.id,
                number: invoiceNumber,
                date: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                customerName: name, 
                customerEmail: email, 
                customerPhone: '',
                customerAddress: '',
                projectTitle: 'System Setup & Registration',
                subtotal: 1500,
                discountPercent: 0,
                discountAmount: 0,
                vatPercent: 0,
                vatAmount: 0,
                grandTotal: 1500,
                notes: 'Automated invoice for system registration and initial setup.',
                paymentInstructions: `Bank: ${company?.bankName || ''} | Acc: ${company?.accountNumber || ''}`,
                status: 'Issued',
                items: {
                    create: [{
                        description: 'Registration & Account Setup',
                        quantity: 1,
                        unitPrice: 1500,
                        amount: 1500
                    }]
                }
            }
        });

        await prisma.document.create({
            data: {
                userId: user.id,
                documentNumber: createdInvoice.number,
                type: 'Invoice',
                customer: createdInvoice.customerName,
                amount: createdInvoice.grandTotal,
                status: createdInvoice.status,
                date: createdInvoice.date,
                referenceId: createdInvoice.id
            }
        });

        const token = app.jwt.sign({
            id: user.id,
            email: user.email,
            name: user.name
        }, { expiresIn: '7d' });
        return reply.send({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: (user as any).role || 'USER'
            }
        });
    });

    // POST /api/auth/login
    app.post('/api/auth/login', async (req, reply) => {
        const { email, password } = req.body as {
            email: string;
            password: string
        };

        if (!email || !password) {
            return reply.status(400).send({ error: 'Email and password are required.' });
        }

        let user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            return reply.status(401).send({ error: 'Invalid email or password.' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return reply.status(401).send({ error: 'Invalid email or password.' });
        }

        // Auto-promote if email matches ADMIN_EMAIL
        if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL && (user as any).role !== 'ADMIN') {
            user = await (prisma.user as any).update({
                where: { id: user.id },
                data: { role: 'ADMIN' }
            });
        }

        const token = app.jwt.sign({
            id: user!.id,
            email: user!.email,
            name: user!.name
        }, { expiresIn: '7d' });
        
        return reply.send({
            token,
            user: {
                id: user!.id,
                name: user!.name,
                email: user!.email,
                role: (user as any).role || 'USER'
            }
        });
    });

    // GET /api/auth/me
    app.get('/api/auth/me', async (req, reply) => {
        try {
            await req.jwtVerify();
            const payload = req.user as {
                id: string;
                email: string;
                name: string
            };
            let user = await prisma.user.findUnique({
                where: {
                    id: payload.id
                }
            });
            if (!user)
                return reply.status(404).send({ error: 'User not found.' });
            
            // Auto-promote if email matches ADMIN_EMAIL
            if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL && (user as any).role !== 'ADMIN') {
                user = await (prisma.user as any).update({
                    where: { id: user.id },
                    data: { role: 'ADMIN' }
                });
            }

            return reply.send({ id: user!.id, name: user!.name, email: user!.email, role: (user as any).role || 'USER' });
        } catch {
            return reply.status(401).send(
                { error: 'Unauthorized.' }
            );
        }
    }
    );

    
    const isAuth = async (req: any, reply: any) => {
        try {
            await req.jwtVerify();
        } catch {
            return reply.status(401).send({ error: 'Unauthorized.' });
        }
    };

    app.get('/api/company', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const company = await prisma.company.findUnique({ where: { userId: (req.user as any)?.id || userId } });
        let isMaintenance = false;
        try {
            const settings = await (prisma as any).adminSettings.findUnique({ where: { id: 'global' } });
            isMaintenance = settings?.maintenanceMode || false;
        } catch { }
        
        if (!company) {
            return reply.send({ setupRequired: true, company: null, maintenanceMode: isMaintenance });
        }
        return reply.send({ setupRequired: false, company, maintenanceMode: isMaintenance });
    });

    app.post('/api/company', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const body = req.body as any;
        let company = await prisma.company.findUnique({ where: { userId } });
        if (company) {
            company = await prisma.company.update({
                where: {
                    id: company.id
                },
                data: body
            });
        } else {
            company = await prisma.company.create({
                data: {
                    userId,
                    ...body
                }
            });
        }
        return reply.send({ success: true, company });
    });

    // 2. File Upload (Logo, Watermark, Signature)
    app.post('/api/upload', async (req, reply) => {
        let data;
        try {
            data = await req.file();
        } catch (err: any) {
            console.error('Multipart parsing failed:', err);
            return reply.status(500).send({ error: 'Multipart parsing failed', details: err.message });
        }

        if (!data) {
            return reply.status(400).send({ error: 'No file uploaded' });
        }
        const fileExt = path.extname(data.filename) || '.png';
        const fileName = `${Date.now()
            }_${Math.random().toString(36).substring(7)
            }${fileExt}`;

        try {
            const buffer = await data.toBuffer();
            // Use Vercel Blob for storage
            const blob = await put(fileName, buffer, { access: 'public' });
            return reply.send({ success: true, url: blob.url });
        } catch (error: any) {
            console.error('Vercel Blob upload failed:', error);
            return reply.status(500).send({ error: 'Upload failed. Check BLOB_READ_WRITE_TOKEN.', details: error.message });
        }
    });

    // 3. Dashboard Statistics
    app.get('/api/dashboard/stats', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const [
            totalInvoices,
            totalQuotations,
            totalReceipts,
            totalLetters,
            recentDocs,
            totalCustomers,
            allInvoices
        ] = await Promise.all([
            prisma.invoice.count(),
            prisma.quotation.count(),
            prisma.receipt.count(),
            prisma.letter.count(),
            prisma.document.findMany({
            where: { userId },
                take: 5,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.customer.count(),
            prisma.invoice.findMany({
            where: { userId }, select: { grandTotal: true, status: true } })
        ]);

        const pendingPaymentsAmount = allInvoices
            .filter(inv => inv.status !== 'Paid')
            .reduce((sum, inv) => sum + inv.grandTotal, 0);

        const paidInvoicesCount = allInvoices.filter(inv => inv.status === 'Paid').length;

        return reply.send({
            totalInvoices,
            totalQuotations,
            totalReceipts,
            totalLetters,
            recentDocs,
            totalCustomers,
            pendingPaymentsAmount,
            paidInvoicesCount
        });
    });

    // Helper for generating document numbers
    async function generateDocNumber(prefix: string, modelName: string, userId: string) {
        const currentYear = new Date().getFullYear();
        let count = 0;
        if (modelName === 'invoice')
            count = await prisma.invoice.count({ where: { userId } });
        else if (modelName === 'quotation')
            count = await prisma.quotation.count({ where: { userId } });
        else if (modelName === 'receipt')
            count = await prisma.receipt.count({ where: { userId } });
        else if (modelName === 'letter')
            count = await prisma.letter.count({ where: { userId } });

        const nextNum = (count + 1).toString().padStart(6, '0');
        return `${prefix}-${currentYear}-${nextNum}`;
    }

    app.get('/api/number-gen/:type', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const { type } = req.params as {
            type: string
        };
        const company = await prisma.company.findUnique({ where: { userId: (req.user as any)?.id || userId } });
        const invPrefix = company?.invoicePrefix || 'INV';
        const qtnPrefix = company?.quotationPrefix || 'QTN';
        const rctPrefix = company?.receiptPrefix || 'RCT';
        const ltrPrefix = company?.letterPrefix || 'LTR';

        let num = '';
        if (type === 'invoice')
            num = await generateDocNumber(invPrefix, 'invoice', (req.user as any)?.id || userId);
        else if (type === 'quotation')
            num = await generateDocNumber(qtnPrefix, 'quotation', (req.user as any)?.id || userId);
        else if (type === 'receipt')
            num = await generateDocNumber(rctPrefix, 'receipt', (req.user as any)?.id || userId);
        else if (type === 'letter')
            num = await generateDocNumber(ltrPrefix, 'letter', (req.user as any)?.id || userId);

        return reply.send({ number: num });
    }
    );

    // 3.5 Customers API
    app.get('/api/customers', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const customers = await prisma.customer.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate total billed for each customer by fetching all their invoices
        const invoices = await prisma.invoice.findMany({
            where: { userId }, select: { customerName: true, grandTotal: true } });

        const customersWithBilled = customers.map(c => {
            const totalBilled = invoices
                .filter(inv => inv.customerName === c.name)
                .reduce((sum, inv) => sum + inv.grandTotal, 0);
            return { ...c, totalBilled };
        });

        return reply.send(customersWithBilled);
    });

    app.post('/api/customers', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const { name, email, phone, address } = req.body as any;
        if (!name) return reply.status(400).send({ error: 'Customer name is required' });

        const customer = await prisma.customer.create({
            data: {
                userId, name, email, phone, address }
        });
        return reply.send(customer);
    });

    // 3.6 Payments API
    app.get('/api/payments', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const invoices = await prisma.invoice.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        // Map invoices to Payment format
        const payments = invoices.map(inv => ({
            id: inv.id,
            invoiceId: inv.number,
            customer: inv.customerName,
            amount: inv.grandTotal,
            status: inv.status === 'Paid' ? 'paid' : 'pending',
            date: inv.date,
            dueDate: inv.dueDate
        }));

        return reply.send(payments);
    });

    // 4. Invoices API
    app.get('/api/invoices', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const invoices = await prisma.invoice.findMany({
            where: { userId },
            include: {
                items: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return reply.send(invoices);
    });

    app.post('/api/invoices', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const data = req.body as any;
        const {
            items,
            ...invoiceData
        } = data;

        const company = await prisma.company.findUnique({ where: { userId: (req.user as any)?.id || userId } });
        if (!invoiceData.number) {
            invoiceData.number = await generateDocNumber(company?.invoicePrefix || 'INV', 'invoice', (req.user as any)?.id || userId);
        }

        const created = await prisma.invoice.create({
            data: {
                userId,
                ...invoiceData,
                items: {
                    create: (items || []).map(
                        (it: any) => ({
                            description: it.description,
                            quantity: Number(it.quantity),
                            unitPrice: Number(it.unitPrice),
                            amount: Number(it.amount)
                        })
                    )
                }
            },
            include: {
                items: true
            }
        });

        // Sync into Document History log
        await prisma.document.upsert({
            where: {
                documentNumber: created.number
            },
            update: {
                customer: created.customerName,
                amount: created.grandTotal,
                status: created.status,
                date: created.date
            },
            create: {
                userId,
                documentNumber: created.number,
                type: 'Invoice',
                customer: created.customerName,
                amount: created.grandTotal,
                status: created.status,
                date: created.date,
                referenceId: created.id
            }
        });

        return reply.send(created);
    });

    app.delete('/api/invoices/:id', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const { id } = req.params as {
            id: string
        };
        const inv = await prisma.invoice.findUnique({
            where: {
                id
            }
        });
        if (inv) {
            await prisma.document.deleteMany({
                where: {
                    documentNumber: inv.number
                }
            });
            await prisma.invoice.delete({
                where: {
                    id
                }
            });
        }
        return reply.send({ success: true });
    });

    // 5. Quotations API
    app.get('/api/quotations', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const quotations = await prisma.quotation.findMany({
            where: { userId },
            include: {
                items: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return reply.send(quotations);
    });

    app.post('/api/quotations', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const data = req.body as any;
        const {
            items,
            ...quotationData
        } = data;

        const company = await prisma.company.findUnique({ where: { userId: (req.user as any)?.id || userId } });
        if (!quotationData.number) {
            quotationData.number = await generateDocNumber(company?.quotationPrefix || 'QTN', 'quotation', (req.user as any)?.id || userId);
        }

        const created = await prisma.quotation.create({
            data: {
                userId,
                ...quotationData,
                items: {
                    create: (items || []).map(
                        (it: any) => ({
                            description: it.description,
                            quantity: Number(it.quantity),
                            unitPrice: Number(it.unitPrice),
                            amount: Number(it.amount)
                        })
                    )
                }
            },
            include: {
                items: true
            }
        });

        await prisma.document.upsert({
            where: {
                documentNumber: created.number
            },
            update: {
                customer: created.customerName,
                amount: created.grandTotal,
                status: created.status,
                date: created.date
            },
            create: {
                userId,
                documentNumber: created.number,
                type: 'Quotation',
                customer: created.customerName,
                amount: created.grandTotal,
                status: created.status,
                date: created.date,
                referenceId: created.id
            }
        });

        return reply.send(created);
    });

    app.post('/api/quotations/:id/convert', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const { id } = req.params as {
            id: string
        };
        const qtn = await prisma.quotation.findUnique({
            where: {
                id
            },
            include: {
                items: true
            }
        });

        if (!qtn) {
            return reply.status(404).send({ error: 'Quotation not found' });
        }

        const company = await prisma.company.findUnique({ where: { userId: (req.user as any)?.id || userId } });
        const invNumber = await generateDocNumber(company?.invoicePrefix || 'INV', 'invoice', (req.user as any)?.id || userId);

        const createdInvoice = await prisma.invoice.create({
            data: {
                userId,
                number: invNumber,
                date: new Date().toISOString().split('T')[0],
                dueDate: qtn.dueDate,
                customerName: qtn.customerName,
                customerPhone: qtn.customerPhone,
                customerEmail: qtn.customerEmail,
                customerAddress: qtn.customerAddress,
                projectTitle: qtn.projectTitle,
                subtotal: qtn.subtotal,
                discountPercent: qtn.discountPercent,
                discountAmount: qtn.discountAmount,
                vatPercent: qtn.vatPercent,
                vatAmount: qtn.vatAmount,
                grandTotal: qtn.grandTotal,
                notes: qtn.notes,
                paymentInstructions: qtn.paymentInstructions,
                status: 'Issued',
                items: {
                    create: qtn.items.map(
                        (it: any) => ({ description: it.description, quantity: it.quantity, unitPrice: it.unitPrice, amount: it.amount })
                    )
                }
            },
            include: {
                items: true
            }
        });

        // Update Quotation status
        await prisma.quotation.update({
            where: {
                id
            },
            data: {
                status: 'Converted',
                convertedToInvoiceId: createdInvoice.id
            }
        });

        // Create Document record
        await prisma.document.create({
            data: {
                userId,
                documentNumber: createdInvoice.number,
                type: 'Invoice',
                customer: createdInvoice.customerName,
                amount: createdInvoice.grandTotal,
                status: createdInvoice.status,
                date: createdInvoice.date,
                referenceId: createdInvoice.id
            }
        });

        return reply.send({ success: true, invoice: createdInvoice });
    });

    app.delete('/api/quotations/:id', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const { id } = req.params as {
            id: string
        };
        const qtn = await prisma.quotation.findUnique({
            where: {
                id
            }
        });
        if (qtn) {
            await prisma.document.deleteMany({
                where: {
                    documentNumber: qtn.number
                }
            });
            await prisma.quotation.delete({
                where: {
                    id
                }
            });
        }
        return reply.send({ success: true });
    });

    // 6. Receipts API
    app.get('/api/receipts', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const receipts = await prisma.receipt.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return reply.send(receipts);
    });

    app.post('/api/receipts', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const data = req.body as any;
        const company = await prisma.company.findUnique({ where: { userId: (req.user as any)?.id || userId } });

        if (!data.number) {
            data.number = await generateDocNumber(company?.receiptPrefix || 'RCT', 'receipt', (req.user as any)?.id || userId);
        }

        const created = await prisma.receipt.create({ data });

        await prisma.document.upsert({
            where: {
                documentNumber: created.number
            },
            update: {
                customer: created.customerName,
                amount: created.amountPaid,
                status: created.status,
                date: created.paymentDate
            },
            create: {
                userId,
                documentNumber: created.number,
                type: 'Receipt',
                customer: created.customerName,
                amount: created.amountPaid,
                status: created.status,
                date: created.paymentDate,
                referenceId: created.id
            }
        });

        return reply.send(created);
    });

    app.delete('/api/receipts/:id', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const { id } = req.params as {
            id: string
        };
        const rct = await prisma.receipt.findUnique({
            where: {
                id
            }
        });
        if (rct) {
            await prisma.document.deleteMany({
                where: {
                    documentNumber: rct.number
                }
            });
            await prisma.receipt.delete({
                where: {
                    id
                }
            });
        }
        return reply.send({ success: true });
    });

    // 7. Letters API
    app.get('/api/letters', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const letters = await prisma.letter.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return reply.send(letters);
    });

    app.post('/api/letters', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const data = req.body as any;
        const company = await prisma.company.findUnique({ where: { userId: (req.user as any)?.id || userId } });

        if (!data.number) {
            data.number = await generateDocNumber(company?.letterPrefix || 'LTR', 'letter', (req.user as any)?.id || userId);
        }

        const created = await prisma.letter.create({ data });

        await prisma.document.upsert({
            where: {
                documentNumber: created.number
            },
            update: {
                customer: created.recipientName,
                amount: 0,
                status: created.status,
                date: created.date
            },
            create: {
                userId,
                documentNumber: created.number,
                type: 'Letter',
                customer: created.recipientName,
                amount: 0,
                status: created.status,
                date: created.date,
                referenceId: created.id
            }
        });

        return reply.send(created);
    });

    app.delete('/api/letters/:id', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const { id } = req.params as {
            id: string
        };
        const ltr = await prisma.letter.findUnique({
            where: {
                id
            }
        });
        if (ltr) {
            await prisma.document.deleteMany({
                where: {
                    documentNumber: ltr.number
                }
            });
            await prisma.letter.delete({
                where: {
                    id
                }
            });
        }
        return reply.send({ success: true });
    });

    // 8. Documents History API
    app.get('/api/documents', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const documents = await prisma.document.findMany({
            where: { userId },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return reply.send(documents);
    });

    app.delete('/api/documents/:id', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const { id } = req.params as {
            id: string
        };
        const doc = await prisma.document.findUnique({
            where: {
                id
            }
        });
        if (doc) {
            if (doc.type === 'Invoice')
                await prisma.invoice.deleteMany({
                    where: {
                        number: doc.documentNumber
                    }
                });
            else if (doc.type === 'Quotation')
                await prisma.quotation.deleteMany({
                    where: {
                        number: doc.documentNumber
                    }
                });
            else if (doc.type === 'Receipt')
                await prisma.receipt.deleteMany({
                    where: {
                        number: doc.documentNumber
                    }
                });
            else if (doc.type === 'Letter')
                await prisma.letter.deleteMany({
                    where: {
                        number: doc.documentNumber
                    }
                });

            await prisma.document.delete({
                where: {
                    id
                }
            });
        }
        return reply.send({ success: true });
    }
    );

    // 9. PDF Generation / Preview Route
    app.post('/api/pdf/generate', { preValidation: [isAuth] }, async (req: any, reply: any) => {
        const userId = (req.user as any).id;
        const { type, data, htmlOnly } = req.body as {
            type: any;
            data: any;
            htmlOnly?: boolean
        };
        const company = await prisma.company.findUnique({ where: { userId: (req.user as any)?.id || userId } });

        if (!company) {
            return reply.status(400).send({ error: 'Company settings not configured yet' });
        }

        // Helper: convert a local /uploads/filename path or remote HTTP URL to a base64 data URI
        async function toBase64DataUri(urlPath: string | null | undefined): Promise<string | null> {
            if (!urlPath)
                return null;
            try {
                if (urlPath.startsWith('http://') || urlPath.startsWith('https://')) {
                    const res = await fetch(urlPath);
                    if (!res.ok)
                        return null;
                    const arrayBuffer = await res.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    const mime = res.headers.get('content-type') || 'image/png';
                    return `data:${mime};base64,${buffer.toString('base64')
                        }`;
                } else { // Extract the filename from the URL path (e.g. /uploads/abc.png -> abc.png)
                    const filename = urlPath.replace(/^\/uploads\//, '');
                    const filePath = path.join(uploadsDir, filename);
                    if (fs.existsSync(filePath)) {
                        const fileBuffer = fs.readFileSync(filePath);
                        const ext = path.extname(filename).toLowerCase().replace('.', '');
                        const mimeMap: Record<string,
                            string> = {
                            png: 'image/png',
                            jpg: 'image/jpeg',
                            jpeg: 'image/jpeg',
                            gif: 'image/gif',
                            svg: 'image/svg+xml',
                            webp: 'image/webp'
                        };
                        const mime = mimeMap[ext] || 'image/png';
                        return `data:${mime};base64,${fileBuffer.toString('base64')
                            }`;
                    }
                }
            } catch (e) {
                console.warn('Failed to read image file for base64 embedding:', urlPath, e);
            }
            return null;
        }

        // Replace URL paths with embedded base64 data URIs
        const companyForPdf = {
            ...company
        };
        companyForPdf.logoUrl = (await toBase64DataUri(company.logoUrl)) || company.logoUrl;
        companyForPdf.watermarkUrl = (await toBase64DataUri(company.watermarkUrl)) || company.watermarkUrl;
        companyForPdf.signatureUrl = (await toBase64DataUri(company.signatureUrl)) || company.signatureUrl;

        const htmlContent = renderDocumentHTML(companyForPdf, type, data);

        // Return rendered HTML (PDF generation is handled on the client side)
        reply.header('Content-Type', 'text/html');
        return reply.send(htmlContent);
    }
    );

    // ── Admin Routes ──────────────────────────────────────────────────

    const isAdmin = async (req: any, reply: any) => {
        try {
            await req.jwtVerify();
            const payload = req.user as { id: string; email: string; name: string };
            const user = await prisma.user.findUnique({ where: { id: payload.id } }) as any;
            if (!user || user.role !== 'ADMIN') {
                return reply.status(403).send({ error: 'Forbidden. Admin only.' });
            }
            req.adminUser = user;
        } catch {
            return reply.status(401).send({ error: 'Unauthorized.' });
        }
    };

    app.get('/api/admin/stats', { preValidation: [isAdmin] }, async (req, reply) => {
        const [totalUsers, activeUsers, proUsers, businessUsers, totalDocuments, recentUsers] = await Promise.all([
            prisma.user.count(),
            (prisma.user as any).count({ where: { isActive: true } }),
            (prisma.user as any).count({ where: { plan: 'PRO' } }),
            (prisma.user as any).count({ where: { plan: 'BUSINESS' } }),
            prisma.document.count(),
            prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 8 })
        ]);
        return reply.send({ totalUsers, activeUsers, proUsers, businessUsers, totalDocuments, recentUsers });
    });

    app.get('/api/admin/users', { preValidation: [isAdmin] }, async (req, reply) => {
        const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
        return reply.send(users);
    });

    app.put('/api/admin/users/:id', { preValidation: [isAdmin] }, async (req: any, reply) => {
        const id = req.params.id;
        const data = req.body as any;
        const user = await prisma.user.update({ where: { id }, data });
        return reply.send(user);
    });

    app.delete('/api/admin/users/:id', { preValidation: [isAdmin] }, async (req: any, reply) => {
        const id = req.params.id;
        await prisma.user.delete({ where: { id } });
        return reply.send({ success: true });
    });

    app.get('/api/admin/payments', { preValidation: [isAdmin] }, async (req, reply) => {
        const payments = await (prisma as any).payment.findMany({ orderBy: { createdAt: 'desc' } });
        return reply.send(payments);
    });

    app.get('/api/admin/settings', { preValidation: [isAdmin] }, async (req, reply) => {
        let settings = await (prisma as any).adminSettings.findUnique({ where: { id: 'global' } });
        if (!settings) {
            settings = await (prisma as any).adminSettings.create({ data: { id: 'global' } });
        }
        return reply.send(settings);
    });

    app.put('/api/admin/settings', { preValidation: [isAdmin] }, async (req: any, reply) => {
        const data = req.body;
        const settings = await (prisma as any).adminSettings.upsert({
            where: { id: 'global' },
            update: data,
            create: { id: 'global', ...data }
        });
        return reply.send(settings);
    });

    // ── Public Pricing ──────────────────────────────────────────────
    app.get('/api/pricing', async (req, reply) => {
        let settings = await (prisma as any).adminSettings.findUnique({ where: { id: 'global' } });
        if (!settings) {
            settings = await (prisma as any).adminSettings.create({ data: { id: 'global' } });
        }
        let pricing = {
            weekly:  { free: '0', pro: '850',   business: '2200'  },
            monthly: { free: '0', pro: '2500',  business: '7500'  },
            yearly:  { free: '0', pro: '22000', business: '65000' }
        };
        try {
            const p = JSON.parse(settings.pricingJson);
            if (p?.weekly) pricing = p;
        } catch { }
        return reply.send({ pricing });
    });

    // ── Paystack Webhook ────────────────────────────────────────────
    // Paystack sends events here; we verify the HMAC-SHA512 signature
    // and handle 'charge.success' to upgrade the user's plan automatically.
    app.post('/api/payments/webhook', async (req, reply) => {
        const secret = process.env.PAYSTACK_SECRET_KEY;
        if (!secret) return reply.status(500).send({ error: 'Not configured' });

        // Verify Paystack signature
        const signature = req.headers['x-paystack-signature'] as string;
        if (!signature) return reply.status(400).send({ error: 'Missing signature' });

        const crypto = await import('crypto');
        const hash = crypto.createHmac('sha512', secret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (hash !== signature) {
            return reply.status(401).send({ error: 'Invalid signature' });
        }

        const event = req.body as any;

        // Handle successful charge
        if (event.event === 'charge.success') {
            const txn = event.data;
            const userEmail = txn?.customer?.email;
            const reference = txn?.reference;
            const amountKobo = txn?.amount || 0;
            const amountNGN = amountKobo / 100;
            const metadata = txn?.metadata || {};
            const plan  = (metadata.plan  || 'PRO').toUpperCase();
            const cycle =  metadata.cycle || 'monthly';

            if (userEmail) {
                const user = await prisma.user.findUnique({ where: { email: userEmail } });
                if (user) {
                    const expiry = new Date();
                    if (cycle === 'weekly') expiry.setDate(expiry.getDate() + 7);
                    else if (cycle === 'yearly') expiry.setFullYear(expiry.getFullYear() + 1);
                    else expiry.setMonth(expiry.getMonth() + 1);

                    await (prisma.user as any).update({
                        where: { id: user.id },
                        data: { plan, planExpiry: expiry }
                    });

                    // Avoid duplicate payment records
                    const existing = await (prisma as any).payment.findFirst({ where: { reference } });
                    if (!existing) {
                        await (prisma as any).payment.create({
                            data: {
                                userId: user.id,
                                userName: user.name,
                                userEmail: user.email,
                                plan,
                                amount: amountNGN,
                                currency: txn?.currency || 'NGN',
                                status: 'Confirmed',
                                reference
                            }
                        });
                    }
                }
            }
        }

        return reply.status(200).send({ received: true });
    });

    // ── Paystack Verify ─────────────────────────────────────────────
    app.post('/api/payments/verify', async (req, reply) => {
        try { await req.jwtVerify(); } catch { return reply.status(401).send({ error: 'Unauthorized' }); }
        const { reference, plan, cycle, amount } = req.body as any;
        if (!reference) return reply.status(400).send({ error: 'Missing reference' });

        const payload = req.user as { id: string; email: string; name: string };
        const user = await prisma.user.findUnique({ where: { id: payload.id } });
        if (!user) return reply.status(404).send({ error: 'User not found' });

        try {
            const secretKey = process.env.PAYSTACK_SECRET_KEY;
            if (!secretKey) return reply.status(500).send({ error: 'Paystack not configured on server' });

            const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
                headers: { Authorization: `Bearer ${secretKey}` }
            });
            const data = await res.json() as any;

            if (data.status && data.data?.status === 'success') {
                const expiry = new Date();
                if (cycle === 'weekly') expiry.setDate(expiry.getDate() + 7);
                else if (cycle === 'yearly') expiry.setFullYear(expiry.getFullYear() + 1);
                else expiry.setMonth(expiry.getMonth() + 1);

                await (prisma.user as any).update({
                    where: { id: user.id },
                    data: { plan: plan.toUpperCase(), planExpiry: expiry }
                });

                await (prisma as any).payment.create({
                    data: {
                        userId: user.id,
                        userName: user.name,
                        userEmail: user.email,
                        plan: plan.toUpperCase(),
                        amount: Number(amount) || (data.data.amount / 100),
                        currency: data.data.currency || 'NGN',
                        status: 'Confirmed',
                        reference
                    }
                });

                return reply.send({ success: true, plan: plan.toUpperCase() });
            } else {
                return reply.status(400).send({ error: 'Payment verification failed' });
            }
        } catch (e: any) {
            console.error(e);
            return reply.status(500).send({ error: 'Failed to verify transaction' });
        }
    });

    if (!process.env.VERCEL) {
        const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
        app.listen({
            port: PORT,
            host: '0.0.0.0'
        }, (err, address) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            console.log(`🚀 Invoicepro API server running at ${address}`);
        });
    }
}

main();

export default async function handler(req: any, res: any) {
    await app.ready();
    app.server.emit('request', req, res);
}

// Disable Vercel's default body parser so fastify-multipart can read the raw stream
export const config = {
    api: {
        bodyParser: false,
    },
};
