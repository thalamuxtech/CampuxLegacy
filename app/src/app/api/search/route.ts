import { NextRequest, NextResponse } from 'next/server';
import { searchGraduates } from '@/lib/demo-data';
import { getAdmin } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  const admin = getAdmin();
  if (!admin) {
    return NextResponse.json({
      results: searchGraduates(q).map((g) => ({
        id: g.id,
        fullName: g.fullName,
        universityName: g.universityName,
        departmentName: g.departmentName,
        year: g.year,
        portraitUrl: g.portraitUrl,
      })),
    });
  }
  // Firestore-backed search: in production, mirror to Algolia/Typesense.
  const snap = await admin.db
    .collection('graduates')
    .where('status', 'in', ['approved', 'sealed'])
    .limit(60)
    .get();
  const needle = q.toLowerCase();
  const results = snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }))
    .filter((g) =>
      !needle || String((g as { fullName: string }).fullName).toLowerCase().includes(needle)
    );
  return NextResponse.json({ results });
}
