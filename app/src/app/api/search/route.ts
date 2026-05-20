import { NextRequest, NextResponse } from 'next/server';
import { searchGraduates } from '@/lib/demo-data';
import { getAdmin } from '@/lib/firebase-admin';

type SearchResult = {
  id: string;
  fullName: string;
  universityName?: string;
  departmentName?: string;
  year: number;
  portraitUrl?: string;
};

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  const admin = getAdmin();
  if (!admin) {
    return NextResponse.json({
      results: searchGraduates(q).map<SearchResult>((g) => ({
        id: g.id,
        fullName: g.fullName,
        universityName: g.universityName,
        departmentName: g.departmentName,
        year: g.year,
        portraitUrl: g.portraitUrl,
      })),
    });
  }
  // Collection-group search over the canonical nested path.
  // In production, mirror approved graduates to Algolia/Typesense for proper text search.
  const snap = await admin.db
    .collectionGroup('graduates')
    .where('status', 'in', ['approved', 'sealed'])
    .limit(60)
    .get();
  const needle = q.toLowerCase();
  const results: SearchResult[] = snap.docs
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        fullName: String(data.fullName ?? ''),
        universityName: data.universityName as string | undefined,
        departmentName: data.departmentName as string | undefined,
        year: Number(data.year ?? 0),
        portraitUrl: data.portraitUrl as string | undefined,
      };
    })
    .filter((g) => !needle || g.fullName.toLowerCase().includes(needle));
  return NextResponse.json({ results });
}
