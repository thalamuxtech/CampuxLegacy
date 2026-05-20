'use client';

import { useAuth } from '@/lib/auth-context';
import { SiteNav } from '@/components/site-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input, Textarea } from '@/components/ui/input';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  Quote,
  Camera,
  Heart,
  Settings,
  LogOut,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { demoGraduates } from '@/lib/demo-data';

export function DashboardClient({
  initialEmail,
}: {
  initialEmail?: string | null;
}) {
  const { user, signOut } = useAuth();
  const displayEmail = user?.email ?? initialEmail ?? null;
  const sample = demoGraduates[0];
  const [tab, setTab] = useState<'profile' | 'memories' | 'goodwills' | 'settings'>(
    'profile'
  );
  const [bio, setBio] = useState(sample.bio ?? '');
  const [quote, setQuote] = useState(sample.quote ?? '');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'memories', label: 'Memories', icon: Quote },
    { id: 'goodwills', label: 'Goodwills', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

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
                {displayEmail ? displayEmail.split('@')[0] : 'Your dashboard'}
              </h1>
            </div>
            <div className="flex gap-2">
              <Badge variant="accent">
                <Clock className="h-3 w-3" /> Pending review
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

            {/* Main editor */}
            <section>
              {tab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-ink/10 bg-white p-7"
                >
                  <p className="serif text-2xl">Your public profile</p>
                  <p className="text-sm text-ink-500 mt-1">
                    Edits are saved as drafts and require approval before publishing.
                  </p>

                  <div className="mt-6 flex items-center gap-4">
                    <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-ink/10">
                      <Image
                        src={sample.portraitUrl}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4" /> Change portrait
                    </Button>
                  </div>

                  <div className="hairline my-6" />

                  <label className="block text-xs uppercase tracking-widest text-ink-400 mb-2">
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
                  />

                  <div className="mt-6 flex gap-2">
                    <Button
                      onClick={() => toast.success('Draft saved. Submit for review when ready.')}
                    >
                      Save draft
                    </Button>
                    <Button
                      variant="accent"
                      onClick={() => toast.success('Submitted for review ✨')}
                    >
                      Submit for review
                    </Button>
                  </div>
                </motion.div>
              )}

              {tab === 'memories' && (
                <div className="rounded-3xl border border-ink/10 bg-white p-7">
                  <p className="serif text-2xl">Memories</p>
                  <p className="text-sm text-ink-500 mt-1">
                    Up to 8 written memories will be sealed into your archive.
                  </p>
                  <div className="mt-6 grid gap-4">
                    {sample.memories.map((m) => (
                      <div
                        key={m.id}
                        className="rounded-2xl border border-ink/10 p-5"
                      >
                        <p className="text-xs text-ink-400">{m.createdAt}</p>
                        <p className="serif text-lg mt-1">{m.title}</p>
                        <p className="text-sm text-ink-600 mt-2">{m.body}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-6">+ Add memory</Button>
                </div>
              )}

              {tab === 'goodwills' && (
                <div className="rounded-3xl border border-ink/10 bg-white p-7">
                  <p className="serif text-2xl">Incoming goodwills</p>
                  <p className="text-sm text-ink-500 mt-1">
                    Approve to show publicly on your profile.
                  </p>
                  <div className="mt-6 space-y-3">
                    {sample.goodwills.map((g) => (
                      <div
                        key={g.id}
                        className="flex items-start justify-between gap-4 rounded-2xl border border-ink/10 p-5"
                      >
                        <div>
                          <p className="text-sm">
                            <b>{g.fromName}</b>{' '}
                            <span className="text-ink-500">· {g.fromRelation}</span>
                          </p>
                          <p className="mt-1 text-sm text-ink-600">"{g.message}"</p>
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
                </div>
              )}

              {tab === 'settings' && (
                <div className="rounded-3xl border border-ink/10 bg-white p-7">
                  <p className="serif text-2xl">Privacy controls</p>
                  <p className="text-sm text-ink-500 mt-1">
                    Choose what is visible publicly versus to approved connections.
                  </p>
                  <div className="mt-6 space-y-3">
                    {(['bio', 'contact', 'memories'] as const).map((field) => (
                      <div
                        key={field}
                        className="flex items-center justify-between rounded-2xl border border-ink/10 p-4"
                      >
                        <p className="capitalize">{field}</p>
                        <select
                          defaultValue={sample.visibility[field]}
                          className="rounded-xl border border-ink/15 bg-paper px-3 py-2 text-sm"
                        >
                          <option value="public">Public</option>
                          <option value="connections">Connections</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Live preview */}
            <aside className="hidden lg:block">
              <p className="text-xs uppercase tracking-widest text-ink-400 mb-3">
                Public preview
              </p>
              <div className="rounded-3xl overflow-hidden bg-white ring-1 ring-ink/10 shadow-xl">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={sample.portraitUrl}
                    alt=""
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-paper">
                    <p className="text-[10px] uppercase opacity-80">
                      Class of {sample.year}
                    </p>
                    <p className="serif text-xl">{sample.fullName}</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="serif italic text-base leading-snug">
                    "{quote}"
                  </p>
                  <p className="text-xs text-ink-500 mt-3 line-clamp-3">{bio}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
