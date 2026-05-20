import { demoGraduates, demoUniversities, demoClasses } from './demo-data';
import type { Goodwill } from './types';

type OnboardingRequest = {
  id: string;
  fullName: string;
  email: string;
  universityName: string;
  role: string;
  phone?: string;
  notes?: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  createdAt: string;
};

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

type GoodwillItem = Goodwill & {
  graduateId: string;
  graduateName: string;
  flagged?: boolean;
};

type AuditEntry = {
  id: string;
  type: string;
  actor: string;
  detail: string;
  at: string;
};

const g = globalThis as unknown as {
  __cl_admin?: {
    onboarding: OnboardingRequest[];
    contacts: ContactMessage[];
    goodwills: GoodwillItem[];
    audit: AuditEntry[];
    bannedGraduates: Set<string>;
  };
};

function seed() {
  if (g.__cl_admin) return g.__cl_admin;
  const onboarding: OnboardingRequest[] = [
    {
      id: 'or-1',
      fullName: 'Dr. Adaobi Mensah',
      email: 'a.mensah@unilag.edu.ng',
      universityName: 'University of Lagos',
      role: 'Dean of Student Affairs',
      phone: '+234 803 555 0102',
      notes:
        'We have ~6,200 students graduating in October. Need crests, branding, and per-faculty rep accounts.',
      status: 'in_review',
      createdAt: '2026-04-12T09:14:00Z',
    },
    {
      id: 'or-2',
      fullName: 'Prof. Tunde Adebayo',
      email: 'tunde.adebayo@oau.edu.ng',
      universityName: 'Obafemi Awolowo University',
      role: 'Vice-Chancellor',
      notes: 'Pilot interest for the Faculty of Engineering, Class of 2026.',
      status: 'pending',
      createdAt: '2026-05-02T13:30:00Z',
    },
    {
      id: 'or-3',
      fullName: 'Halima Bello',
      email: 'h.bello@ui.edu.ng',
      universityName: 'University of Ibadan',
      role: 'Alumni Relations Director',
      notes: 'Want to seal all classes back to 2022 retroactively.',
      status: 'approved',
      createdAt: '2026-03-28T08:00:00Z',
    },
    {
      id: 'or-4',
      fullName: 'Engr. Kayode Williams',
      email: 'kayode@covenantuniversity.edu.ng',
      universityName: 'Covenant University',
      role: 'Registrar',
      notes: 'Need a quote for 4,400 graduates.',
      status: 'pending',
      createdAt: '2026-05-10T16:42:00Z',
    },
  ];

  const contacts: ContactMessage[] = [
    {
      id: 'cm-1',
      name: 'Chinedu Okeke',
      email: 'chinedu@example.com',
      subject: 'Profile not approved yet',
      message:
        'Hi, I submitted my profile two weeks ago and have not heard back. My class is sealing soon.',
      read: false,
      createdAt: '2026-05-11T10:24:00Z',
    },
    {
      id: 'cm-2',
      name: 'Ifeoma Nwosu',
      email: 'ifeoma@example.com',
      subject: 'Press inquiry',
      message:
        'BusinessDay would love to feature CampuxLegacy in our Education Innovation issue.',
      read: false,
      createdAt: '2026-05-10T15:09:00Z',
    },
    {
      id: 'cm-3',
      name: 'Babatunde Lawal',
      email: 'b.lawal@example.com',
      subject: 'Can you support polytechnics?',
      message:
        'Asking on behalf of Yaba Tech. We have an alumni archive project that needs this.',
      read: true,
      createdAt: '2026-05-06T07:55:00Z',
    },
  ];

  const goodwills: GoodwillItem[] = demoGraduates.slice(0, 6).map((grad, i) => ({
    id: `pending-gw-${i}`,
    graduateId: grad.id,
    graduateName: grad.fullName,
    fromName: ['Aisha S.', 'Mr. Adekunle', 'Cohort 2026', 'Kemi O.', 'Chinedu E.', 'Mum'][i],
    fromRelation: ['Classmate', 'Lecturer', 'Friends', 'Roommate', 'Best friend', 'Mother'][i],
    message: [
      'You inspired all of us in CSC404. Onwards.',
      'I am proud to have taught you. Go far.',
      'Cohort 2026 forever. The group chat lives on.',
      'From late-night noodles to convocation gowns 💛',
      'You showed up for me when no one else did. Thank you.',
      'I prayed every day of this journey. Today, we celebrate.',
    ][i],
    approved: false,
    flagged: i === 2,
    createdAt: new Date(Date.now() - i * 3600_000).toISOString(),
  }));

  const audit: AuditEntry[] = [
    { id: 'a-1', type: 'class.sealed', actor: 'superadmin@cl', detail: 'UI · Class of 2024 sealed (manifest: a7f3…)', at: '2026-04-15T14:00:00Z' },
    { id: 'a-2', type: 'graduate.approved', actor: 'rep@unilag', detail: '28 profiles auto-approved', at: '2026-04-22T09:12:00Z' },
    { id: 'a-3', type: 'goodwill.flagged', actor: 'system', detail: '1 message flagged for review (link)', at: '2026-05-09T11:03:00Z' },
    { id: 'a-4', type: 'onboarding.requested', actor: 'system', detail: 'New onboarding request from Covenant University', at: '2026-05-10T16:42:00Z' },
  ];

  g.__cl_admin = { onboarding, contacts, goodwills, audit, bannedGraduates: new Set() };
  return g.__cl_admin;
}

export function adminStore() {
  return seed();
}

export function adminMetrics() {
  const s = adminStore();
  const totalGraduates = demoGraduates.length;
  const sealed = demoGraduates.filter((g) => g.status === 'sealed').length;
  const live = demoGraduates.filter((g) => g.status === 'approved').length;
  const draft = demoGraduates.filter((g) => g.status === 'draft' || g.status === 'pending_review').length;
  return {
    universities: demoUniversities.length,
    classes: demoClasses.length,
    totalGraduates,
    sealedGraduates: sealed,
    liveGraduates: live,
    pendingGraduates: draft,
    pendingOnboarding: s.onboarding.filter((o) => o.status === 'pending').length,
    inReviewOnboarding: s.onboarding.filter((o) => o.status === 'in_review').length,
    pendingGoodwills: s.goodwills.filter((g) => !g.approved).length,
    flaggedGoodwills: s.goodwills.filter((g) => g.flagged).length,
    unreadContacts: s.contacts.filter((c) => !c.read).length,
  };
}

export function addOnboarding(o: Omit<OnboardingRequest, 'id' | 'createdAt' | 'status'>) {
  const s = adminStore();
  const id = `or-${Date.now().toString(36)}`;
  s.onboarding.unshift({
    ...o,
    id,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  return id;
}

export function updateOnboardingStatus(id: string, status: OnboardingRequest['status']) {
  const s = adminStore();
  const item = s.onboarding.find((o) => o.id === id);
  if (item) {
    item.status = status;
    s.audit.unshift({
      id: `a-${Date.now()}`,
      type: 'onboarding.' + status,
      actor: 'admin',
      detail: `${item.universityName} → ${status}`,
      at: new Date().toISOString(),
    });
  }
  return item;
}

export function addContact(c: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) {
  const s = adminStore();
  const id = `cm-${Date.now().toString(36)}`;
  s.contacts.unshift({ ...c, id, read: false, createdAt: new Date().toISOString() });
  return id;
}

export function markContactRead(id: string, read = true) {
  const s = adminStore();
  const c = s.contacts.find((c) => c.id === id);
  if (c) c.read = read;
  return c;
}

export function deleteContact(id: string) {
  const s = adminStore();
  s.contacts = s.contacts.filter((c) => c.id !== id);
  g.__cl_admin = s;
}

export function approveGoodwill(id: string) {
  const s = adminStore();
  const gw = s.goodwills.find((g) => g.id === id);
  if (gw) {
    gw.approved = true;
    gw.flagged = false;
    s.audit.unshift({
      id: `a-${Date.now()}`,
      type: 'goodwill.approved',
      actor: 'admin',
      detail: `For ${gw.graduateName}`,
      at: new Date().toISOString(),
    });
  }
  return gw;
}

export function rejectGoodwill(id: string) {
  const s = adminStore();
  s.goodwills = s.goodwills.filter((g) => g.id !== id);
  g.__cl_admin = s;
}

export function addGoodwill(input: { graduateId: string; fromName: string; fromRelation?: string; message: string }) {
  const s = adminStore();
  const grad = demoGraduates.find((g) => g.id === input.graduateId);
  const id = `gw-${Date.now().toString(36)}`;
  s.goodwills.unshift({
    id,
    graduateId: input.graduateId,
    graduateName: grad?.fullName ?? 'Unknown',
    fromName: input.fromName,
    fromRelation: input.fromRelation,
    message: input.message,
    approved: false,
    flagged: /https?:\/\//i.test(input.message),
    createdAt: new Date().toISOString(),
  });
  return id;
}

export function classDistribution() {
  const byYear = new Map<number, number>();
  for (const g of demoGraduates) {
    byYear.set(g.year, (byYear.get(g.year) ?? 0) + 1);
  }
  return Array.from(byYear.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, count]) => ({ year, count }));
}

export function universityBreakdown() {
  return demoUniversities.map((u) => ({
    id: u.id,
    name: u.name,
    graduates: demoGraduates.filter((g) => g.universityId === u.id).length,
    classes: demoClasses.filter((c) => c.universityId === u.id).length,
  }));
}

export function recentSignups(limit = 8) {
  return demoGraduates
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, limit);
}
