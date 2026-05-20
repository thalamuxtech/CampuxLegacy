'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  User as UserIcon,
  Quote,
  Camera,
  Heart,
  Settings,
  LogOut,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Loader2,
  Link2,
  Sparkles,
  Save,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { SiteNav } from '@/components/site-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Textarea } from '@/components/ui/input';
import { demoGraduates } from '@/lib/demo-data';
import { getFirebase } from '@/lib/firebase';
import { ref as storageRef, uploadBytes } from 'firebase/storage';
import type { Graduate, Memory, Visibility } from '@/lib/types';

type Mode = 'loading' | 'demo' | 'unlinked' | 'linked';

type Profile = {
  id: string;
  fullName: string;
  preferredName?: string;
  portraitUrl: string;
  universityName: string;
  schoolName?: string;
  departmentName?: string;
  year: number;
  status: string;
  bio?: string;
  quote?: string;
  socials?: { instagram?: string; linkedin?: string; twitter?: string };
  visibility?: { bio?: Visibility; contact?: Visibility; memories?: Visibility };
  memories?: Memory[];
  goodwills?: Graduate['goodwills'];
  sealedAt?: string;
};

export function DashboardClient({
  initialEmail,
}: {
  initialEmail?: string | null;
}) {
  const { user, signOut, configured } = useAuth();
  const displayEmail = user?.email ?? initialEmail ?? null;

  const [mode, setMode] = useState<Mode>('loading');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [tab, setTab] = useState<'profile' | 'memories' | 'goodwills' | 'settings'>(
    'profile'
  );
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [claimId, setClaimId] = useState('');
  const [claimSubmitting, setClaimSubmitting] = useState(false);

  // Local edit state, hydrated from profile.
  const [bio, setBio] = useState('');
  const [quote, setQuote] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [visibility, setVisibility] = useState<{
    bio: Visibility;
    contact: Visibility;
    memories: Visibility;
  }>({ bio: 'public', contact: 'private', memories: 'public' });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!configured) {
        // Demo mode: fall back to the first demo graduate.
        const sample = demoGraduates[0];
        if (cancelled) return;
        setMode('demo');
        const p: Profile = {
          id: sample.id,
          fullName: sample.fullName,
          preferredName: sample.preferredName,
          portraitUrl: sample.portraitUrl,
          universityName: sample.universityName,
          schoolName: sample.schoolName,
          departmentName: sample.departmentName,
          year: sample.year,
          status: sample.status,
          bio: sample.bio,
          quote: sample.quote,
          socials: sample.socials,
          visibility: sample.visibility,
          memories: sample.memories,
          goodwills: sample.goodwills,
        };
        setProfile(p);
        setMemories(p.memories ?? []);
        hydrate(p);
        return;
      }
      try {
        const res = await fetch('/api/me');
        const data = await res.json();
        if (cancelled) return;
        if (!data.graduate) {
          setMode('unlinked');
          return;
        }
        const g = data.graduate as Graduate;
        const p: Profile = {
          id: g.id,
          fullName: g.fullName ?? '',
          preferredName: g.preferredName,
          portraitUrl: g.portraitUrl ?? '',
          universityName: g.universityName ?? '',
          schoolName: g.schoolName,
          departmentName: g.departmentName,
          year: g.year ?? 0,
          status: g.status ?? 'draft',
          bio: g.bio,
          quote: g.quote,
          socials: g.socials,
          visibility: g.visibility,
          memories: g.memories ?? [],
          goodwills: g.goodwills ?? [],
        };
        setProfile(p);
        hydrate(p);
        // Load memories sub-collection separately.
        const memRes = await fetch('/api/me/memories');
        const memData = await memRes.json();
        if (!cancelled) setMemories(memData.memories ?? []);
        setMode('linked');
      } catch {
        if (!cancelled) {
          toast.error('Could not load your profile.');
          setMode('demo');
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [configured]);

  function hydrate(p: Profile) {
    setBio(p.bio ?? '');
    setQuote(p.quote ?? '');
    setPreferredName(p.preferredName ?? '');
    setInstagram(p.socials?.instagram ?? '');
    setLinkedin(p.socials?.linkedin ?? '');
    if (p.visibility) {
      setVisibility({
        bio: p.visibility.bio ?? 'public',
        contact: p.visibility.contact ?? 'private',
        memories: p.visibility.memories ?? 'public',
      });
    }
  }

  async function onSaveDraft() {
    if (mode === 'demo') {
      toast.success('Demo mode: draft saved locally.');
      return;
    }
    if (mode !== 'linked') return;
    setSaving(true);
    try {
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          bio,
          quote,
          preferredName,
          socials: { instagram, linkedin },
          visibility,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Save failed');
      toast.success('Draft saved.');
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function onSubmitForReview() {
    if (mode === 'demo') {
      toast.success('Demo mode: submitted for review ✨');
      return;
    }
    if (mode !== 'linked') return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          bio,
          quote,
          preferredName,
          socials: { instagram, linkedin },
          visibility,
          submitForReview: true,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Submit failed');
      toast.success('Submitted for review ✨');
      setProfile((p) => (p ? { ...p, status: 'pending_review' } : p));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function onClaim(e: React.FormEvent) {
    e.preventDefault();
    if (!claimId.trim()) return;
    setClaimSubmitting(true);
    try {
      const res = await fetch('/api/me/claim', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ graduateId: claimId.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not claim');
      toast.success('Profile claimed.');
      if (data.refreshIdToken) {
        // Force a token refresh so the new graduateIds claim becomes available
        // for Storage uploads.
        const fb = getFirebase();
        if (fb?.auth.currentUser) await fb.auth.currentUser.getIdToken(true);
      }
      // Re-load.
      window.location.reload();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setClaimSubmitting(false);
    }
  }

  const portraitInputRef = useRef<HTMLInputElement>(null);
  async function onPortraitChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    if (mode === 'demo') {
      toast.info('Demo mode: portrait would upload to Storage.');
      e.target.value = '';
      return;
    }
    if (mode !== 'linked') {
      toast.error('Claim your profile first.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Portrait must be under 10 MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Pick an image file.');
      return;
    }
    setUploading(true);
    try {
      const fb = getFirebase();
      if (!fb) throw new Error('Storage unavailable.');
      // Refresh ID token so graduateIds claim is fresh.
      if (fb.auth.currentUser) await fb.auth.currentUser.getIdToken(true);
      const path = `graduates/${profile.id}/portrait/original`;
      const r = storageRef(fb.storage, path);
      await uploadBytes(r, file, { contentType: file.type });
      toast.success('Portrait uploaded. Variants ready in ~30s.');
    } catch (err) {
      toast.error(
        (err as Error).message ?? 'Could not upload portrait.'
      );
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  }

  const tabs = useMemo(
    () =>
      [
        { id: 'profile', label: 'Profile', icon: UserIcon },
        { id: 'memories', label: 'Memories', icon: Quote },
        { id: 'goodwills', label: 'Goodwills', icon: Heart },
        { id: 'settings', label: 'Settings', icon: Settings },
      ] as const,
    []
  );

  if (mode === 'loading') {
    return (
      <>
        <SiteNav />
        <main className="pt-24 pb-16">
          <div className="container">
            <div className="h-8 w-64 rounded-2xl bg-ink/5 animate-pulse" />
            <div className="mt-10 grid lg:grid-cols-[220px_1fr_360px] gap-8">
              <div className="h-64 rounded-3xl bg-ink/5 animate-pulse" />
              <div className="h-[500px] rounded-3xl bg-ink/5 animate-pulse" />
              <div className="h-[500px] rounded-3xl bg-ink/5 animate-pulse" />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (mode === 'unlinked') {
    return (
      <>
        <SiteNav />
        <main className="pt-24 pb-16">
          <div className="container max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-ink/10 bg-white p-10"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent">
                <Link2 className="h-5 w-5" />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent-700 mt-6">
                Claim your profile
              </p>
              <h1 className="serif text-4xl mt-2">
                One last step before your dashboard opens.
              </h1>
              <p className="mt-4 text-ink-600">
                Your university representative has likely already created a
                profile for you. Enter the graduate ID they shared to link it to
                your account.
              </p>
              <form onSubmit={onClaim} className="mt-8 space-y-3">
                <Input
                  value={claimId}
                  onChange={(e) => setClaimId(e.target.value)}
                  placeholder="e.g. unilag-2026-12"
                  required
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={claimSubmitting}
                >
                  {claimSubmitting ? 'Linking…' : 'Link my profile'}
                </Button>
              </form>
              <p className="mt-6 text-xs text-ink-500">
                Signed in as <b className="text-ink-700">{displayEmail}</b>.{' '}
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="underline underline-offset-4"
                >
                  Sign out
                </button>
              </p>
            </motion.div>
          </div>
        </main>
      </>
    );
  }

  const p = profile!;

  return (
    <>
      <SiteNav />
      <main className="pt-24 pb-16">
        <div className="container">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent-700">
                Welcome back
              </p>
              <h1 className="serif text-4xl mt-2">
                {preferredName ||
                  (displayEmail ? displayEmail.split('@')[0] : p.fullName)}
              </h1>
              {mode === 'demo' && (
                <p className="mt-2 text-xs text-accent-700">
                  Demo mode — changes won&apos;t persist.
                </p>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <Badge variant={p.status === 'approved' ? 'accent' : 'outline'}>
                {p.status === 'approved' ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <Clock className="h-3 w-3" />
                )}
                {p.status === 'pending_review'
                  ? 'Pending review'
                  : p.status === 'approved'
                  ? 'Approved'
                  : p.status === 'sealed'
                  ? 'Sealed'
                  : 'Draft'}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </div>
          </div>

          <div className="mt-10 grid lg:grid-cols-[220px_1fr_360px] gap-8">
            {/* Sidebar */}
            <aside>
              <ul className="space-y-1">
                {tabs.map((t) => (
                  <li key={t.id}>
                    <button
                      onClick={() => setTab(t.id)}
                      className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors ${
                        tab === t.id
                          ? 'bg-ink text-paper'
                          : 'hover:bg-ink/5 text-ink-700'
                      }`}
                    >
                      <t.icon className="h-4 w-4" />
                      {t.label}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <section>
              <AnimatePresence mode="wait">
                {tab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-3xl border border-ink/10 bg-white p-7"
                  >
                    <p className="serif text-2xl">Your public profile</p>
                    <p className="text-sm text-ink-500 mt-1">
                      Edits are saved as drafts and require approval before
                      publishing.
                    </p>

                    <div className="mt-6 flex items-center gap-4">
                      <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-ink/10">
                        {p.portraitUrl && (
                          <Image
                            src={p.portraitUrl}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <input
                        ref={portraitInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onPortraitChange}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => portraitInputRef.current?.click()}
                        disabled={uploading}
                      >
                        {uploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                        {uploading ? 'Uploading…' : 'Change portrait'}
                      </Button>
                    </div>

                    <div className="hairline my-6" />

                    <label className="block text-xs uppercase tracking-widest text-ink-400 mb-2">
                      Preferred name
                    </label>
                    <Input
                      value={preferredName}
                      onChange={(e) => setPreferredName(e.target.value)}
                      placeholder={p.fullName.split(' ')[0]}
                      maxLength={80}
                    />

                    <label className="block text-xs uppercase tracking-widest text-ink-400 mt-5 mb-2">
                      Preferred quote
                    </label>
                    <Input
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      placeholder="A line you'll be remembered for…"
                      maxLength={200}
                    />

                    <label className="block text-xs uppercase tracking-widest text-ink-400 mt-5 mb-2">
                      Short bio
                    </label>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={600}
                      placeholder="A few sentences your classmates will recognise."
                    />
                    <p className="mt-1 text-[10px] text-ink-400 text-right">
                      {bio.length}/600
                    </p>

                    <div className="grid sm:grid-cols-2 gap-3 mt-5">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-ink-400 mb-2">
                          Instagram
                        </label>
                        <Input
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value)}
                          placeholder="username"
                          maxLength={60}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-ink-400 mb-2">
                          LinkedIn
                        </label>
                        <Input
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="profile-id"
                          maxLength={120}
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex gap-2 flex-wrap">
                      <Button onClick={onSaveDraft} disabled={saving}>
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Save draft
                      </Button>
                      <Button
                        variant="accent"
                        onClick={onSubmitForReview}
                        disabled={submitting || p.status === 'sealed'}
                      >
                        {submitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        Submit for review
                      </Button>
                    </div>
                  </motion.div>
                )}

                {tab === 'memories' && (
                  <motion.div
                    key="memories"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-3xl border border-ink/10 bg-white p-7"
                  >
                    <MemoriesPanel
                      memories={memories}
                      setMemories={setMemories}
                      disabled={mode !== 'linked'}
                      sealed={p.status === 'sealed'}
                    />
                  </motion.div>
                )}

                {tab === 'goodwills' && (
                  <motion.div
                    key="goodwills"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-3xl border border-ink/10 bg-white p-7"
                  >
                    <p className="serif text-2xl">Incoming goodwills</p>
                    <p className="text-sm text-ink-500 mt-1">
                      Approved messages appear on your profile. Moderation
                      happens server-side.
                    </p>
                    <div className="mt-6 space-y-3">
                      {(p.goodwills ?? []).length === 0 && (
                        <div className="rounded-2xl border border-dashed border-ink/15 p-8 text-center text-ink-500">
                          No goodwills yet.
                        </div>
                      )}
                      {(p.goodwills ?? []).map((g) => (
                        <div
                          key={g.id}
                          className="flex items-start justify-between gap-4 rounded-2xl border border-ink/10 p-5"
                        >
                          <div>
                            <p className="text-sm">
                              <b>{g.fromName}</b>
                              {g.fromRelation && (
                                <span className="text-ink-500"> · {g.fromRelation}</span>
                              )}
                            </p>
                            <p className="mt-1 text-sm text-ink-600">
                              &quot;{g.message}&quot;
                            </p>
                          </div>
                          <Badge variant={g.approved ? 'accent' : 'outline'}>
                            {g.approved ? (
                              <>
                                <CheckCircle2 className="h-3 w-3" /> Approved
                              </>
                            ) : (
                              'Pending'
                            )}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {tab === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-3xl border border-ink/10 bg-white p-7"
                  >
                    <p className="serif text-2xl">Privacy controls</p>
                    <p className="text-sm text-ink-500 mt-1">
                      Choose what is visible publicly versus to approved
                      connections.
                    </p>
                    <div className="mt-6 space-y-3">
                      {(['bio', 'contact', 'memories'] as const).map((field) => (
                        <div
                          key={field}
                          className="flex items-center justify-between rounded-2xl border border-ink/10 p-4"
                        >
                          <p className="capitalize">{field}</p>
                          <select
                            value={visibility[field]}
                            onChange={(e) =>
                              setVisibility((v) => ({
                                ...v,
                                [field]: e.target.value as Visibility,
                              }))
                            }
                            className="rounded-xl border border-ink/15 bg-paper px-3 py-2 text-sm"
                          >
                            <option value="public">Public</option>
                            <option value="connections">Connections</option>
                            <option value="private">Private</option>
                          </select>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Button onClick={onSaveDraft} disabled={saving}>
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Save settings
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Live preview */}
            <aside className="hidden lg:block lg:sticky lg:top-28 self-start">
              <p className="text-xs uppercase tracking-widest text-ink-400 mb-3">
                Public preview
              </p>
              <motion.div
                layout
                className="rounded-3xl overflow-hidden bg-white ring-1 ring-ink/10 shadow-xl"
              >
                <div className="relative aspect-[4/5] bg-ink/5">
                  {p.portraitUrl && (
                    <Image
                      src={p.portraitUrl}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-paper">
                    <p className="text-[10px] uppercase opacity-80">
                      Class of {p.year}
                    </p>
                    <p className="serif text-xl">
                      {preferredName || p.fullName}
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  {quote && (
                    <p className="serif italic text-base leading-snug">
                      &quot;{quote}&quot;
                    </p>
                  )}
                  {bio && (
                    <p className="text-xs text-ink-500 mt-3 line-clamp-4">
                      {bio}
                    </p>
                  )}
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

function MemoriesPanel({
  memories,
  setMemories,
  disabled,
  sealed,
}: {
  memories: Memory[];
  setMemories: React.Dispatch<React.SetStateAction<Memory[]>>;
  disabled: boolean;
  sealed: boolean;
}) {
  const [draftTitle, setDraftTitle] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  async function addMemory(e: React.FormEvent) {
    e.preventDefault();
    if (sealed) return;
    if (disabled) {
      toast.info('Demo mode: memory added locally.');
      setMemories((arr) => [
        {
          id: `local-${Date.now()}`,
          title: draftTitle,
          body: draftBody,
          createdAt: new Date().toISOString(),
        },
        ...arr,
      ]);
      setDraftTitle('');
      setDraftBody('');
      setAdding(false);
      return;
    }
    setBusy('new');
    try {
      const res = await fetch('/api/me/memories', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: draftTitle, body: draftBody }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not add');
      setMemories((arr) => [data.memory, ...arr]);
      setDraftTitle('');
      setDraftBody('');
      setAdding(false);
      toast.success('Memory added.');
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function removeMemory(id: string) {
    if (sealed) return;
    if (disabled) {
      setMemories((arr) => arr.filter((m) => m.id !== id));
      return;
    }
    setBusy(id);
    try {
      const res = await fetch(`/api/me/memories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Could not delete');
      setMemories((arr) => arr.filter((m) => m.id !== id));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="serif text-2xl">Memories</p>
          <p className="text-sm text-ink-500 mt-1">
            Up to 8 written memories will be sealed into your archive.
          </p>
        </div>
        {!sealed && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAdding((v) => !v)}
          >
            <Plus className="h-4 w-4" /> {adding ? 'Cancel' : 'Add memory'}
          </Button>
        )}
      </div>
      <AnimatePresence>
        {adding && (
          <motion.form
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            onSubmit={addMemory}
            className="mt-5 rounded-2xl border border-ink/10 p-5 overflow-hidden"
          >
            <Input
              required
              maxLength={80}
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="Title"
            />
            <Textarea
              required
              minLength={1}
              maxLength={800}
              value={draftBody}
              onChange={(e) => setDraftBody(e.target.value)}
              placeholder="What happened?"
              className="mt-3"
            />
            <div className="mt-3 flex justify-end">
              <Button type="submit" disabled={busy === 'new'}>
                {busy === 'new' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save memory
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      <div className="mt-6 grid gap-4">
        {memories.length === 0 && (
          <div className="rounded-2xl border border-dashed border-ink/15 p-12 text-center text-ink-500">
            No memories yet. Add one to begin.
          </div>
        )}
        {memories.map((m) => (
          <motion.div
            key={m.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-ink/10 p-5 relative group"
          >
            <p className="text-xs text-ink-400">
              {new Date(m.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <p className="serif text-lg mt-1">{m.title}</p>
            <p className="text-sm text-ink-600 mt-2">{m.body}</p>
            {!sealed && (
              <button
                onClick={() => removeMemory(m.id)}
                disabled={busy === m.id}
                aria-label="Delete memory"
                className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-rose/10 text-rose transition-opacity disabled:opacity-50"
              >
                {busy === m.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </>
  );
}
