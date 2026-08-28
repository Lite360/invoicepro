import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Users, CreditCard, Activity,
  Shield, FileText, DollarSign, ChevronRight,
  Search, Edit2, Trash2, Check, X, RefreshCw,
  ToggleLeft, ToggleRight, Save, AlertTriangle, ArrowLeft, UserCheck, BadgeCheck
} from 'lucide-react';
import { AdminUser, AdminSettings, AdminPayment } from '../types';

const API = import.meta.env.VITE_API_URL || '';

type AdminTab = 'overview' | 'users' | 'pricing' | 'trials' | 'payments';

const PLAN_COLORS: Record<string, string> = {
  FREE:     'bg-slate-700 text-slate-300',
  PRO:      'bg-blue-900 text-blue-300',
  BUSINESS: 'bg-purple-900 text-purple-300',
};

const STATUS_COLORS: Record<string, string> = {
  Confirmed: 'bg-emerald-900 text-emerald-300',
  Pending:   'bg-amber-900  text-amber-300',
  Failed:    'bg-red-900    text-red-300',
};

interface Props { onBack: () => void; }

interface Stats {
  totalUsers: number;
  activeUsers: number;
  proUsers: number;
  businessUsers: number;
  totalDocuments: number;
  recentUsers: AdminUser[];
}

interface PricingGrid {
  weekly:  { free: string; pro: string; business: string };
  monthly: { free: string; pro: string; business: string };
  yearly:  { free: string; pro: string; business: string };
}

const DEFAULT_PRICING: PricingGrid = {
  weekly:  { free: '0', pro: '850',   business: '2200'  },
  monthly: { free: '0', pro: '2500',  business: '7500'  },
  yearly:  { free: '0', pro: '22000', business: '65000' },
};

const DOC_TYPES = ['Invoice', 'Quotation', 'Receipt', 'Letter'];

export function AdminPanel({ onBack }: Props) {
  const [tab,           setTab]           = useState<AdminTab>('overview');
  const [stats,         setStats]         = useState<Stats | null>(null);
  const [users,         setUsers]         = useState<AdminUser[]>([]);
  const [payments,      setPayments]      = useState<AdminPayment[]>([]);
  const [settings,      setSettings]      = useState<AdminSettings | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [editingUser,   setEditingUser]   = useState<AdminUser | null>(null);
  const [pricing,       setPricing]       = useState<PricingGrid>(DEFAULT_PRICING);
  const [trialLimit,    setTrialLimit]    = useState(5);
  const [trialDocTypes, setTrialDocTypes] = useState<string[]>(DOC_TYPES);
  const [saving,        setSaving]        = useState(false);
  const [toast,         setToast]         = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const token       = localStorage.getItem('invoicepro_token');
  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchStats    = useCallback(async () => {
    const res = await fetch(`${API}/api/admin/stats`,    { headers: authHeaders });
    if (res.ok) setStats(await res.json());
  }, []);
  const fetchUsers    = useCallback(async () => {
    const res = await fetch(`${API}/api/admin/users`,    { headers: authHeaders });
    if (res.ok) setUsers(await res.json());
  }, []);
  const fetchPayments = useCallback(async () => {
    const res = await fetch(`${API}/api/admin/payments`, { headers: authHeaders });
    if (res.ok) setPayments(await res.json());
  }, []);
  const fetchSettings = useCallback(async () => {
    const res = await fetch(`${API}/api/admin/settings`, { headers: authHeaders });
    if (!res.ok) return;
    const data: AdminSettings = await res.json();
    setSettings(data);
    setTrialLimit(data.freeTrialLimit);
    try { const p = JSON.parse(data.pricingJson);  if (p?.weekly) setPricing(p); }    catch { /**/ }
    try { const d = JSON.parse(data.trialDocTypes); if (Array.isArray(d)) setTrialDocTypes(d); } catch { /**/ }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchStats(), fetchUsers(), fetchPayments(), fetchSettings()]).finally(() => setLoading(false));
  }, []);

  // ── user CRUD ──────────────────────────────────────────────────
  const saveUser = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/admin/users/${editingUser.id}`, {
        method: 'PUT', headers: authHeaders,
        body: JSON.stringify({ plan: editingUser.plan, role: editingUser.role, trialUsed: editingUser.trialUsed, isActive: editingUser.isActive }),
      });
      if (res.ok) { showToast('User updated'); setEditingUser(null); fetchUsers(); fetchStats(); }
      else          showToast('Failed to update user', 'error');
    } finally { setSaving(false); }
  };

  const deleteUser = async (id: string) => {
    const res = await fetch(`${API}/api/admin/users/${id}`, { method: 'DELETE', headers: authHeaders });
    if (res.ok) { showToast('User deleted'); setDeleteConfirm(null); fetchUsers(); fetchStats(); }
    else          showToast('Failed', 'error');
  };

  const resetTrials = async (id: string) => {
    const res = await fetch(`${API}/api/admin/users/${id}`, {
      method: 'PUT', headers: authHeaders, body: JSON.stringify({ trialUsed: 0 }),
    });
    if (res.ok) { showToast('Trial usage reset'); fetchUsers(); }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/admin/settings`, {
        method: 'PUT', headers: authHeaders,
        body: JSON.stringify({ freeTrialLimit: trialLimit, pricingJson: JSON.stringify(pricing), trialDocTypes: JSON.stringify(trialDocTypes) }),
      });
      if (res.ok) { showToast('Settings saved'); fetchSettings(); }
      else          showToast('Failed to save settings', 'error');
    } finally { setSaving(false); }
  };

  const toggleDocType = (dt: string) =>
    setTrialDocTypes(prev => prev.includes(dt) ? prev.filter(d => d !== dt) : [...prev, dt]);

  const filteredUsers = users.filter(u =>
    (u?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview',  label: 'Overview',  icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'users',     label: 'Users',     icon: <Users           className="w-4 h-4" /> },
    { id: 'pricing',   label: 'Pricing',   icon: <DollarSign      className="w-4 h-4" /> },
    { id: 'trials',    label: 'Trials',    icon: <Activity        className="w-4 h-4" /> },
    { id: 'payments',  label: 'Payments',  icon: <CreditCard      className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-slate-900 flex" style={{ fontFamily: "'Inter',sans-serif" }}>

      {/* ── Toast ────────────────────────────────────────────────── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[9999] px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2 ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* ── Delete confirm ────────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white shadow-sm border border-slate-300 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-bold mb-1">Delete User?</h3>
            <p className="text-slate-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-sm font-semibold transition">Cancel</button>
              <button onClick={() => deleteUser(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold transition">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit user modal ───────────────────────────────────────── */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white shadow-sm border border-slate-300 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">Edit User</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-500 hover:text-slate-900"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-3 bg-white rounded-xl text-sm">
                <div><p className="text-xs text-slate-500 mb-0.5">Name</p><p className="font-medium">{editingUser.name}</p></div>
                <div><p className="text-xs text-slate-500 mb-0.5">Email</p><p className="font-medium truncate">{editingUser.email}</p></div>
              </div>
              {[
                { label: 'PLAN', key: 'plan', options: ['FREE','PRO','BUSINESS'] },
                { label: 'ROLE', key: 'role', options: ['USER','ADMIN'] },
              ].map(({ label, key, options }) => (
                <div key={key}>
                  <label className="text-xs text-slate-500 font-semibold mb-1 block">{label}</label>
                  <select
                    value={(editingUser as any)[key]}
                    onChange={e => setEditingUser({ ...editingUser, [key]: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F9D58]/50"
                  >
                    {options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">TRIAL USED</label>
                <input type="number" min={0} value={editingUser.trialUsed}
                  onChange={e => setEditingUser({ ...editingUser, trialUsed: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F9D58]/50" />
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                <span className="text-sm font-medium">Account Active</span>
                <button onClick={() => setEditingUser({ ...editingUser, isActive: !editingUser.isActive })}>
                  {editingUser.isActive
                    ? <ToggleRight className="w-8 h-8 text-emerald-400" />
                    : <ToggleLeft  className="w-8 h-8 text-slate-500" />}
                </button>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingUser(null)} className="flex-1 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-sm font-semibold transition">Cancel</button>
              <button onClick={saveUser} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#0F9D58] text-white hover:bg-[#b8f000] text-sm font-bold transition disabled:opacity-50">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <aside className="w-60 shrink-0 bg-[#111111] border-r border-slate-200 flex flex-col">
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#0F9D58] rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold leading-none">InvoicePro</p>
              <p className="text-xs text-[#0F9D58] font-semibold mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === item.id ? 'bg-[#0F9D58] text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
              {item.icon}{item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-200">
          <button onClick={onBack}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition">
            <ArrowLeft className="w-4 h-4" />Back to App
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#0D0D0D]/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold capitalize">{tab}</h1>
            <p className="text-xs text-slate-500">InvoicePro Platform Management</p>
          </div>
          <button onClick={() => { fetchStats(); fetchUsers(); fetchPayments(); fetchSettings(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-sm font-medium transition">
            <RefreshCw className="w-4 h-4" />Refresh
          </button>
        </div>

        <div className="p-8 flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="animate-spin w-8 h-8 rounded-full border-2 border-[#0F9D58]/20 border-t-[#CAFF33]" />
            </div>
          ) : (
            <>
              {/* ── OVERVIEW ───────────────────────────────────────── */}
              {tab === 'overview' && stats && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label:'Total Users',    value: stats.totalUsers,    icon:<Users      className="w-5 h-5"/>, color:'text-blue-400',      bg:'bg-blue-400/10'    },
                      { label:'Active Users',   value: stats.activeUsers,   icon:<UserCheck  className="w-5 h-5"/>, color:'text-emerald-400',   bg:'bg-emerald-400/10' },
                      { label:'Pro / Business', value:`${stats.proUsers} / ${stats.businessUsers}`, icon:<BadgeCheck className="w-5 h-5"/>, color:'text-purple-400', bg:'bg-purple-400/10' },
                      { label:'Total Docs',     value: stats.totalDocuments,icon:<FileText   className="w-5 h-5"/>, color:'text-[#0F9D58]',    bg:'bg-[#0F9D58]/10'   },
                    ].map(card => (
                      <div key={card.label} className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
                        <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3 ${card.color}`}>{card.icon}</div>
                        <p className="text-2xl font-bold">{card.value}</p>
                        <p className="text-xs text-slate-500 mt-1">{card.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                      <h2 className="font-semibold text-sm">Recent Signups</h2>
                      <button onClick={() => setTab('users')} className="text-xs text-[#0F9D58] font-semibold hover:underline flex items-center gap-1">
                        View All <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="divide-y divide-slate-200">
                      {stats.recentUsers.slice(0,8).map(u => (
                        <div key={u.id} className="px-6 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#0F9D58]/10 text-[#0F9D58] flex items-center justify-center text-xs font-bold uppercase">{ (u?.name || 'U').charAt(0) }</div>
                            <div><p className="text-sm font-medium">{u?.name || 'Unknown'}</p><p className="text-xs text-slate-500">{u?.email || ''}</p></div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PLAN_COLORS[u.plan]||'bg-slate-700 text-slate-300'}`}>{u.plan}</span>
                            <span className={`w-2 h-2 rounded-full ${u.isActive?'bg-emerald-400':'bg-red-400'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── USERS ──────────────────────────────────────────── */}
              {tab === 'users' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input type="text" placeholder="Search users…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F9D58]/50 placeholder-slate-500" />
                    </div>
                    <span className="text-sm text-slate-500">{filteredUsers.length} users</span>
                  </div>
                  <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200">
                            {['USER','PLAN','ROLE','TRIAL','STATUS','JOINED',''].map(h => (
                              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 first:pl-6">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {filteredUsers.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                              <td className="pl-6 pr-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-[#0F9D58]/10 text-[#0F9D58] flex items-center justify-center text-xs font-bold uppercase shrink-0">{(u?.name || 'U').charAt(0)}</div>
                                  <div><p className="font-medium">{u?.name || 'Unknown'}</p><p className="text-xs text-slate-500">{u?.email || ''}</p></div>
                                </div>
                              </td>
                              <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PLAN_COLORS[u.plan]||''}`}>{u.plan}</span></td>
                              <td className="px-4 py-3">
                                {u.role==='ADMIN'
                                  ? <span className="flex items-center gap-1 text-[#0F9D58] text-xs font-semibold"><Shield className="w-3 h-3"/>ADMIN</span>
                                  : <span className="text-slate-500 text-xs">USER</span>}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono">{u.trialUsed}/{settings?.freeTrialLimit??5}</span>
                                  <button onClick={() => resetTrials(u.id)} title="Reset" className="text-slate-500 hover:text-[#0F9D58] transition"><RefreshCw className="w-3.5 h-3.5"/></button>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`flex items-center gap-1.5 text-xs font-semibold ${u.isActive?'text-emerald-400':'text-red-400'}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${u.isActive?'bg-emerald-400':'bg-red-400'}`}/>
                                  {u.isActive?'Active':'Disabled'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <button onClick={() => setEditingUser(u)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"><Edit2 className="w-3.5 h-3.5"/></button>
                                  <button onClick={() => setDeleteConfirm(u.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition"><Trash2 className="w-3.5 h-3.5"/></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {filteredUsers.length===0 && <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500">No users found</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ── PRICING ────────────────────────────────────────── */}
              {tab === 'pricing' && (
                <div className="space-y-6 max-w-3xl">
                  <p className="text-slate-500 text-sm">Edit the prices shown on the public Pricing page. Amounts in NGN (₦).</p>
                  {(['weekly','monthly','yearly'] as const).map(cycle => (
                    <div key={cycle} className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
                      <div className="px-6 py-4 border-b border-slate-200"><h3 className="font-semibold capitalize">{cycle}</h3></div>
                      <div className="p-6 grid grid-cols-3 gap-4">
                        {(['free','pro','business'] as const).map(plan => (
                          <div key={plan}>
                            <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase">{plan}</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₦</span>
                              <input type="number" min={0} value={pricing[cycle][plan]}
                                onChange={e => setPricing(prev => ({ ...prev, [cycle]: { ...prev[cycle], [plan]: e.target.value } }))}
                                disabled={plan==='free'}
                                className="w-full bg-white border border-slate-300 rounded-xl pl-7 pr-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0F9D58]/50 disabled:opacity-40" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={saveSettings} disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F9D58] text-white font-bold hover:bg-[#b8f000] transition disabled:opacity-50">
                    <Save className="w-4 h-4"/>{saving?'Saving…':'Save Pricing'}
                  </button>
                </div>
              )}

              {/* ── TRIALS ─────────────────────────────────────────── */}
              {tab === 'trials' && (
                <div className="space-y-6 max-w-xl">
                  <p className="text-slate-500 text-sm">Configure how many free documents new users get and which types count toward the trial.</p>
                  <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6 space-y-6">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-2 block">FREE TRIAL DOCUMENT LIMIT</label>
                      <p className="text-xs text-slate-500 mb-4">Number of free documents each new user gets before needing a subscription.</p>
                      <div className="flex items-center gap-5">
                        <button onClick={() => setTrialLimit(Math.max(0, trialLimit-1))}
                          className="w-11 h-11 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center text-2xl font-bold transition">−</button>
                        <span className="text-5xl font-black tabular-nums w-16 text-center text-[#0F9D58]">{trialLimit}</span>
                        <button onClick={() => setTrialLimit(trialLimit+1)}
                          className="w-11 h-11 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center text-2xl font-bold transition">+</button>
                      </div>
                    </div>
                    <div className="pt-5 border-t border-slate-200">
                      <label className="text-xs font-semibold text-slate-500 mb-2 block">DOCUMENT TYPES COUNTED TOWARD TRIAL</label>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        {DOC_TYPES.map(dt => (
                          <button key={dt} onClick={() => toggleDocType(dt)}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition ${trialDocTypes.includes(dt)?'bg-[#0F9D58]/10 border-[#0F9D58]/40 text-[#0F9D58]':'bg-white border-slate-300 text-slate-500'}`}>
                            {dt}
                            {trialDocTypes.includes(dt)?<Check className="w-4 h-4"/>:<X className="w-4 h-4 opacity-30"/>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={saveSettings} disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F9D58] text-white font-bold hover:bg-[#b8f000] transition disabled:opacity-50">
                    <Save className="w-4 h-4"/>{saving?'Saving…':'Save Trial Settings'}
                  </button>
                </div>
              )}

              {/* ── PAYMENTS ───────────────────────────────────────── */}
              {tab === 'payments' && (
                <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="font-semibold text-sm">All Payments</h2>
                    <span className="text-xs text-slate-500">{payments.length} records</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200">
                          {['USER','PLAN','AMOUNT','STATUS','REFERENCE','DATE'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 first:pl-6">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {payments.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="pl-6 pr-4 py-3"><p className="font-medium">{p.userName}</p><p className="text-xs text-slate-500">{p.userEmail}</p></td>
                            <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PLAN_COLORS[p.plan]||''}`}>{p.plan}</span></td>
                            <td className="px-4 py-3 font-mono font-semibold text-[#0F9D58]">₦{p.amount.toLocaleString()}</td>
                            <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[p.status]||''}`}>{p.status}</span></td>
                            <td className="px-4 py-3 text-xs text-slate-500 font-mono">{p.reference||'—'}</td>
                            <td className="px-4 py-3 text-xs text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                        {payments.length===0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No payment records yet</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
