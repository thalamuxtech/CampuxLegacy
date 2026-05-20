'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Search, Shield, ShieldOff, Loader2, UserPlus, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ROLES = [
  'superadmin',
  'university_admin',
  'rep',
  'official',
  'alumni',
  'student',
] as const;

type Role = (typeof ROLES)[number];

type UserRow = {
  uid: string;
  email: string | null;
  displayName: string | null;
  roles: Partial<Record<Role, boolean>>;
  createdAt?: string;
  lastSignIn?: string;
};

export function RolesManager({ demoMode }: { demoMode: boolean }) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [grantEmail, setGrantEmail] = useState('');
  const [grantRole, setGrantRole] = useState<Role>('rep');
  const [granting, setGranting] = useState(false);

  async function load() {
    if (demoMode) {
      setUsers([
        {
          uid: 'demo-1',
          email: 'demo-admin@campuxlegacy.app',
          displayName: 'Demo Admin',
          roles: { superadmin: true },
        },
        {
          uid: 'demo-2',
          email: 'rep@unilag.edu.ng',
          displayName: 'UniLag Rep',
          roles: { rep: true },
        },
      ]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/roles?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not load users');
      setUsers(data.users ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = setTimeout(load, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function toggle(user: UserRow, role: Role) {
    const enabled = !user.roles[role];
    if (demoMode) {
      setUsers((prev) =>
        prev.map((u) =>
          u.uid === user.uid
            ? { ...u, roles: { ...u.roles, [role]: enabled } }
            : u
        )
      );
      toast.info('Demo mode: claim toggled locally.');
      return;
    }
    setBusy(user.uid + role);
    try {
      const res = await fetch('/api/admin/roles', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, role, enabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      setUsers((prev) =>
        prev.map((u) =>
          u.uid === user.uid
            ? { ...u, roles: data.roles ?? { ...u.roles, [role]: enabled } }
            : u
        )
      );
      toast.success(`${enabled ? 'Granted' : 'Revoked'} ${role}.`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function grantByEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!grantEmail.trim()) return;
    if (demoMode) {
      toast.info('Demo mode: would grant role.');
      return;
    }
    setGranting(true);
    try {
      const res = await fetch('/api/admin/roles', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: grantEmail.trim(),
          role: grantRole,
          enabled: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      toast.success(`${grantRole} granted to ${grantEmail}.`);
      setGrantEmail('');
      load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setGranting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-white border border-ink/10 p-5 shadow-soft">
        <p className="text-xs uppercase tracking-widest text-ink-400 mb-3">
          Grant a role by email
        </p>
        <form onSubmit={grantByEmail} className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[260px]">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <Input
              type="email"
              value={grantEmail}
              onChange={(e) => setGrantEmail(e.target.value)}
              placeholder="email@university.edu"
              className="pl-9"
              required
            />
          </div>
          <select
            value={grantRole}
            onChange={(e) => setGrantRole(e.target.value as Role)}
            className="h-10 rounded-2xl border border-ink/15 bg-paper px-3 text-sm"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <Button type="submit" variant="accent" disabled={granting}>
            {granting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            Grant
          </Button>
        </form>
      </div>

      <div className="rounded-3xl bg-white border border-ink/10 p-4 shadow-soft">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search users by email, name or uid"
            className="pl-9"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose/30 bg-rose/[0.04] p-5 text-sm text-rose">
          {error}
        </div>
      )}

      <div className="rounded-3xl bg-white border border-ink/10 overflow-hidden shadow-soft">
        {loading ? (
          <div className="p-8 grid place-items-center text-ink-500">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-ink-500">
            <p className="serif text-2xl">No users yet.</p>
            <p className="mt-2 text-sm">
              {q ? 'No matches for that query.' : 'Sign-ups will appear here.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-ink/5 max-h-[64vh] overflow-auto">
            {users.map((u, i) => (
              <motion.li
                key={u.uid}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 15) * 0.02 }}
                className="px-5 py-4 hover:bg-ink/[0.02] transition-colors"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">
                      {u.displayName ?? u.email ?? u.uid}
                    </p>
                    {u.email && (
                      <p className="text-xs text-ink-500">{u.email}</p>
                    )}
                    <p className="text-[10px] text-ink-400 mt-0.5">{u.uid}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ROLES.map((r) => {
                      const active = Boolean(u.roles[r]);
                      const isBusy = busy === u.uid + r;
                      return (
                        <button
                          key={r}
                          onClick={() => toggle(u, r)}
                          disabled={isBusy}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                            active
                              ? 'bg-ink text-paper'
                              : 'bg-ink/5 text-ink-600 hover:bg-ink/10'
                          } disabled:opacity-50`}
                        >
                          {isBusy ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : active ? (
                            <Shield className="h-3 w-3 inline -mt-0.5" />
                          ) : (
                            <ShieldOff className="h-3 w-3 inline -mt-0.5" />
                          )}{' '}
                          {r}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {(u.lastSignIn || u.createdAt) && (
                  <div className="mt-2 flex gap-3 text-[10px] text-ink-400">
                    {u.lastSignIn && (
                      <Badge variant="outline" className="text-[10px]">
                        last: {new Date(u.lastSignIn).toLocaleDateString()}
                      </Badge>
                    )}
                    {u.createdAt && (
                      <Badge variant="outline" className="text-[10px]">
                        joined: {new Date(u.createdAt).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                )}
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
