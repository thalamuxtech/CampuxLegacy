import 'server-only';
import { getAdmin } from './firebase-admin';

export type OnboardingDoc = {
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

export type ContactDoc = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type AuditDoc = {
  id: string;
  type: string;
  actor: string;
  detail: string;
  at: string;
};

export type GoodwillDoc = {
  id: string;
  graduateId: string;
  graduateName?: string;
  fromName: string;
  fromRelation?: string;
  message: string;
  approved: boolean;
  flagged?: boolean;
  createdAt: string;
  parentPath?: string;
};

export type GraduateLite = {
  id: string;
  fullName: string;
  portraitUrl: string;
  universityId: string;
  classId: string;
  year: number;
  status: string;
  createdAt: string;
  universityName?: string;
  schoolName?: string;
  departmentName?: string;
};

function toISO(v: unknown): string {
  if (!v) return new Date(0).toISOString();
  if (typeof v === 'string') return v;
  const anyV = v as { toDate?: () => Date };
  if (anyV.toDate) return anyV.toDate().toISOString();
  return new Date(0).toISOString();
}

export async function listOnboarding(): Promise<OnboardingDoc[] | null> {
  const admin = getAdmin();
  if (!admin) return null;
  const snap = await admin.db
    .collection('onboardingRequests')
    .orderBy('createdAt', 'desc')
    .limit(200)
    .get();
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      fullName: data.fullName ?? '',
      email: data.email ?? '',
      universityName: data.universityName ?? '',
      role: data.role ?? '',
      phone: data.phone,
      notes: data.notes,
      status: (data.status as OnboardingDoc['status']) ?? 'pending',
      createdAt: toISO(data.createdAt),
    };
  });
}

export async function listContacts(): Promise<ContactDoc[] | null> {
  const admin = getAdmin();
  if (!admin) return null;
  const snap = await admin.db
    .collection('contacts')
    .orderBy('createdAt', 'desc')
    .limit(200)
    .get();
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name ?? '',
      email: data.email ?? '',
      subject: data.subject ?? '',
      message: data.message ?? '',
      read: Boolean(data.read),
      createdAt: toISO(data.createdAt),
    };
  });
}

export async function listAudit(limit = 50): Promise<AuditDoc[] | null> {
  const admin = getAdmin();
  if (!admin) return null;
  const snap = await admin.db
    .collection('audit')
    .orderBy('at', 'desc')
    .limit(limit)
    .get();
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      type: data.type ?? 'unknown',
      actor: data.by ?? data.actor ?? 'system',
      detail: data.detail ?? data.manifest ?? '',
      at: toISO(data.at),
    };
  });
}

export async function listPendingGoodwills(): Promise<GoodwillDoc[] | null> {
  const admin = getAdmin();
  if (!admin) return null;
  const snap = await admin.db
    .collectionGroup('goodwills')
    .where('approved', '==', false)
    .orderBy('createdAt', 'desc')
    .limit(200)
    .get();
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      graduateId: d.ref.parent.parent?.id ?? '',
      graduateName: data.graduateName,
      fromName: data.fromName ?? '',
      fromRelation: data.fromRelation,
      message: data.message ?? '',
      approved: Boolean(data.approved),
      flagged: Boolean(data.flagged),
      createdAt: toISO(data.createdAt),
      parentPath: d.ref.parent.parent?.path,
    };
  });
}

export async function listUniversities(): Promise<
  Array<{
    id: string;
    name: string;
    slug: string;
    city: string;
    country: string;
    graduatesCount: number;
    classesCount: number;
    branding?: { primary?: string; accent?: string };
    coverImage?: string;
    crestImage?: string;
  }> | null
> {
  const admin = getAdmin();
  if (!admin) return null;
  const snap = await admin.db.collection('universities').limit(100).get();
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name ?? d.id,
      slug: data.slug ?? d.id,
      city: data.city ?? '',
      country: data.country ?? '',
      graduatesCount: data.graduatesCount ?? 0,
      classesCount: data.classesCount ?? 0,
      branding: data.branding,
      coverImage: data.coverImage,
      crestImage: data.crestImage,
    };
  });
}

export async function listGraduates(
  opts: { status?: string; limit?: number } = {}
): Promise<GraduateLite[] | null> {
  const admin = getAdmin();
  if (!admin) return null;
  let q = admin.db.collectionGroup('graduates').limit(opts.limit ?? 100);
  if (opts.status) q = q.where('status', '==', opts.status);
  const snap = await q.get();
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      fullName: data.fullName ?? '',
      portraitUrl: data.portraitUrl ?? '',
      universityId: data.universityId ?? '',
      classId: data.classId ?? '',
      year: data.year ?? 0,
      status: data.status ?? 'draft',
      createdAt: toISO(data.createdAt),
      universityName: data.universityName,
      schoolName: data.schoolName,
      departmentName: data.departmentName,
    };
  });
}

export async function updateOnboardingDoc(
  id: string,
  status: OnboardingDoc['status'],
  actorUid: string
): Promise<boolean> {
  const admin = getAdmin();
  if (!admin) return false;
  const ref = admin.db.collection('onboardingRequests').doc(id);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.update({ status, updatedAt: new Date().toISOString() });
  await admin.db.collection('audit').add({
    type: `onboarding.${status}`,
    by: actorUid,
    detail: `${snap.data()?.universityName ?? id} → ${status}`,
    at: new Date().toISOString(),
  });
  return true;
}

export async function markContactDoc(
  id: string,
  read: boolean
): Promise<boolean> {
  const admin = getAdmin();
  if (!admin) return false;
  const ref = admin.db.collection('contacts').doc(id);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.update({ read });
  return true;
}

export async function deleteContactDoc(id: string): Promise<boolean> {
  const admin = getAdmin();
  if (!admin) return false;
  await admin.db.collection('contacts').doc(id).delete();
  return true;
}

export async function approveGoodwillByPath(
  goodwillPath: string,
  actorUid: string
): Promise<boolean> {
  const admin = getAdmin();
  if (!admin) return false;
  const ref = admin.db.doc(goodwillPath);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.update({ approved: true, flagged: false });
  await admin.db.collection('audit').add({
    type: 'goodwill.approved',
    by: actorUid,
    detail: goodwillPath,
    at: new Date().toISOString(),
  });
  return true;
}

export async function rejectGoodwillByPath(
  goodwillPath: string,
  actorUid: string
): Promise<boolean> {
  const admin = getAdmin();
  if (!admin) return false;
  const ref = admin.db.doc(goodwillPath);
  await ref.delete();
  await admin.db.collection('audit').add({
    type: 'goodwill.rejected',
    by: actorUid,
    detail: goodwillPath,
    at: new Date().toISOString(),
  });
  return true;
}

/* ---------- Public read helpers ---------- */

export type UniversityDoc = {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  motto?: string;
  coverImage?: string;
  crestImage?: string;
  branding?: { primary?: string; accent?: string };
  graduatesCount: number;
  classesCount: number;
};

export type ClassDoc = {
  id: string;
  universityId: string;
  year: number;
  theme?: string;
  coverImage?: string;
  status: 'open' | 'review' | 'launched' | 'sealed';
  graduatesCount: number;
  sealedAt?: string;
};

export async function listUniversitiesPublic(): Promise<UniversityDoc[] | null> {
  const admin = getAdmin();
  if (!admin) return null;
  const snap = await admin.db.collection('universities').limit(200).get();
  if (snap.empty) return [];
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name ?? d.id,
      slug: data.slug ?? d.id,
      city: data.city ?? '',
      country: data.country ?? '',
      motto: data.motto,
      coverImage: data.coverImage,
      crestImage: data.crestImage,
      branding: data.branding,
      graduatesCount: Number(data.graduatesCount ?? 0),
      classesCount: Number(data.classesCount ?? 0),
    };
  });
}

export async function getUniversityBySlugPublic(
  slug: string
): Promise<UniversityDoc | null> {
  const admin = getAdmin();
  if (!admin) return null;
  const snap = await admin.db
    .collection('universities')
    .where('slug', '==', slug)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data();
  return {
    id: d.id,
    name: data.name ?? d.id,
    slug: data.slug ?? d.id,
    city: data.city ?? '',
    country: data.country ?? '',
    motto: data.motto,
    coverImage: data.coverImage,
    crestImage: data.crestImage,
    branding: data.branding,
    graduatesCount: Number(data.graduatesCount ?? 0),
    classesCount: Number(data.classesCount ?? 0),
  };
}

export async function listClassesForUniversity(
  universityId: string
): Promise<ClassDoc[] | null> {
  const admin = getAdmin();
  if (!admin) return null;
  const snap = await admin.db
    .collection(`universities/${universityId}/classes`)
    .orderBy('year', 'desc')
    .limit(200)
    .get();
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      universityId,
      year: Number(data.year ?? 0),
      theme: data.theme,
      coverImage: data.coverImage,
      status: (data.status as ClassDoc['status']) ?? 'open',
      graduatesCount: Number(data.graduatesCount ?? 0),
      sealedAt: data.sealedAt,
    };
  });
}

export async function getClass(
  universityId: string,
  year: number
): Promise<ClassDoc | null> {
  const admin = getAdmin();
  if (!admin) return null;
  const snap = await admin.db
    .collection(`universities/${universityId}/classes`)
    .where('year', '==', year)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data();
  return {
    id: d.id,
    universityId,
    year: Number(data.year ?? year),
    theme: data.theme,
    coverImage: data.coverImage,
    status: (data.status as ClassDoc['status']) ?? 'open',
    graduatesCount: Number(data.graduatesCount ?? 0),
    sealedAt: data.sealedAt,
  };
}

export async function listGraduatesForClassPublic(
  universityId: string,
  classId: string
): Promise<unknown[] | null> {
  const admin = getAdmin();
  if (!admin) return null;
  const snap = await admin.db
    .collection(`universities/${universityId}/classes/${classId}/graduates`)
    .where('status', 'in', ['approved', 'sealed'])
    .limit(500)
    .get();
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
}

export async function getGraduatePublic(graduateId: string): Promise<{
  graduate: unknown;
  universitySlug: string | null;
  goodwills: unknown[];
  memories: unknown[];
} | null> {
  const admin = getAdmin();
  if (!admin) return null;
  const snap = await admin.db
    .collectionGroup('graduates')
    .where('id', '==', graduateId)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const gradDoc = snap.docs[0];
  const data = gradDoc.data();
  const universityId = data.universityId as string | undefined;
  let universitySlug: string | null = null;
  if (universityId) {
    const uniSnap = await admin.db
      .collection('universities')
      .doc(universityId)
      .get();
    universitySlug = (uniSnap.data()?.slug as string) ?? null;
  }
  const goodwillsSnap = await gradDoc.ref
    .collection('goodwills')
    .where('approved', '==', true)
    .limit(60)
    .get();
  const memoriesSnap = await gradDoc.ref.collection('memories').limit(20).get();
  return {
    graduate: { ...data, id: gradDoc.id },
    universitySlug,
    goodwills: goodwillsSnap.docs.map((d) => ({ ...d.data(), id: d.id })),
    memories: memoriesSnap.docs.map((d) => ({ ...d.data(), id: d.id })),
  };
}
