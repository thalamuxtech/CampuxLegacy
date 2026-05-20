import type { Graduate, University, ClassYear } from './types';

const portraitPool = [
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1601412436009-d964bd02edbc?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
];

const nigerianFirst = [
  'Adaeze', 'Chinedu', 'Tunde', 'Bisi', 'Ifeoma', 'Oluwaseun', 'Aminat',
  'Emeka', 'Folake', 'Kemi', 'Nnamdi', 'Yetunde', 'Obinna', 'Halima',
  'Tobi', 'Ngozi', 'Sade', 'Uche', 'Chidi', 'Aisha', 'Babatunde',
  'Chioma', 'Damilola', 'Ezinne', 'Fatima', 'Gbenga', 'Hauwa', 'Ibrahim',
  'Jumoke', 'Kayode', 'Lola', 'Maryam', 'Nkechi', 'Olamide', 'Patience',
];
const nigerianLast = [
  'Okeke', 'Adebayo', 'Okafor', 'Eze', 'Bello', 'Nwosu', 'Olawale',
  'Ibrahim', 'Adeyemi', 'Nwankwo', 'Lawal', 'Ogundipe', 'Hassan',
  'Chukwu', 'Sanusi', 'Akinyemi', 'Onyema', 'Aliyu', 'Balogun',
];
const departments = [
  { id: 'cs', name: 'Computer Science', school: 'School of Computing & Engineering' },
  { id: 'law', name: 'Law', school: 'Faculty of Law' },
  { id: 'med', name: 'Medicine & Surgery', school: 'College of Health Sciences' },
  { id: 'eng', name: 'Mechanical Engineering', school: 'School of Computing & Engineering' },
  { id: 'eco', name: 'Economics', school: 'Faculty of Social Sciences' },
  { id: 'arc', name: 'Architecture', school: 'School of Environmental Studies' },
  { id: 'eng-lit', name: 'English & Literature', school: 'Faculty of Arts' },
  { id: 'biz', name: 'Business Administration', school: 'School of Business' },
];
const quotes = [
  'We made it — together, on time, slightly out of breath.',
  'For every late night in the library, this is the receipt.',
  'I came for a degree. I left with a family.',
  'The lecture halls forgot us. The friendships did not.',
  'From first matriculation to final convocation — what a story.',
  'Built different. Graduated together.',
  'Four years, one heartbeat.',
  'Where dreams started taking surnames.',
];

const universities: University[] = [
  {
    id: 'ui',
    name: 'University of Ibadan',
    slug: 'university-of-ibadan',
    city: 'Ibadan',
    country: 'Nigeria',
    motto: 'Recte Sapere Fons',
    coverImage:
      'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=1600&q=80',
    crestImage:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80',
    branding: { primary: '#0B3A2E', accent: '#B8854A' },
    graduatesCount: 12842,
    classesCount: 6,
  },
  {
    id: 'unilag',
    name: 'University of Lagos',
    slug: 'university-of-lagos',
    city: 'Lagos',
    country: 'Nigeria',
    motto: 'In Deed and in Truth',
    coverImage:
      'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=1600&q=80',
    branding: { primary: '#0B2A4A', accent: '#C49A4A' },
    graduatesCount: 18244,
    classesCount: 8,
  },
  {
    id: 'oau',
    name: 'Obafemi Awolowo University',
    slug: 'obafemi-awolowo-university',
    city: 'Ile-Ife',
    country: 'Nigeria',
    motto: 'For Learning and Culture',
    coverImage:
      'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=1600&q=80',
    branding: { primary: '#3A0B2E', accent: '#B8854A' },
    graduatesCount: 9134,
    classesCount: 4,
  },
  {
    id: 'covenant',
    name: 'Covenant University',
    slug: 'covenant-university',
    city: 'Ota',
    country: 'Nigeria',
    motto: 'Raising a New Generation of Leaders',
    coverImage:
      'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1600&q=80',
    branding: { primary: '#1F2B5C', accent: '#D4AF55' },
    graduatesCount: 6420,
    classesCount: 3,
  },
];

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function makeGraduate(i: number, uni: University, year: number): Graduate {
  const r = rng(i + year + uni.id.length * 17);
  const first = nigerianFirst[Math.floor(r() * nigerianFirst.length)];
  const last = nigerianLast[Math.floor(r() * nigerianLast.length)];
  const dep = departments[Math.floor(r() * departments.length)];
  const portrait = portraitPool[Math.floor(r() * portraitPool.length)];
  const quote = quotes[Math.floor(r() * quotes.length)];
  return {
    id: `${uni.id}-${year}-${i}`,
    uid: null,
    universityId: uni.id,
    universityName: uni.name,
    schoolId: dep.id + '-school',
    schoolName: dep.school,
    departmentId: dep.id,
    departmentName: dep.name,
    classId: String(year),
    year,
    fullName: `${first} ${last}`,
    preferredName: first,
    portraitUrl: portrait,
    bio: `${first} graduated with honours in ${dep.name}. Outside lectures, served as a peer mentor and volunteered with the campus debate society.`,
    quote,
    socials: { instagram: `${first.toLowerCase()}.${last.toLowerCase()}` },
    visibility: { bio: 'public', contact: 'private', memories: 'public' },
    status: year === 2026 ? 'approved' : 'sealed',
    memories: [
      {
        id: `${i}-m1`,
        title: 'First day on campus',
        body: 'I missed the orientation venue twice and ended up at a debate club instead. Best wrong turn of my life.',
        createdAt: '2022-09-12',
      },
      {
        id: `${i}-m2`,
        title: 'The all-nighter that built us',
        body: 'Six of us, one whiteboard, three pots of noodles. We still talk about that submission.',
        createdAt: '2024-03-21',
      },
    ],
    goodwills: [
      {
        id: `${i}-g1`,
        fromName: 'Mum',
        fromRelation: 'Mother',
        message: 'I have prayed every step. So proud of the woman/man you are becoming.',
        approved: true,
        createdAt: '2026-04-02',
      },
      {
        id: `${i}-g2`,
        fromName: 'Tobi A.',
        fromRelation: 'Best friend',
        message: 'From level 100 carry-overs to convocation. Onwards, legend.',
        approved: true,
        createdAt: '2026-04-08',
      },
    ],
    createdAt: '2025-09-01',
    updatedAt: '2026-04-12',
    sealedAt: year < 2026 ? `${year}-07-15` : undefined,
  };
}

const allGraduates: Graduate[] = [];
const allClasses: ClassYear[] = [];
universities.forEach((uni) => {
  [2023, 2024, 2025, 2026].forEach((year) => {
    const count = year === 2026 ? 36 : 24;
    for (let i = 0; i < count; i++) {
      allGraduates.push(makeGraduate(i, uni, year));
    }
    allClasses.push({
      id: `${uni.id}-${year}`,
      universityId: uni.id,
      year,
      theme:
        year === 2026
          ? 'The Resilient Set'
          : year === 2025
          ? 'The Renaissance Class'
          : year === 2024
          ? 'Bridges & Breakthroughs'
          : 'Foundations',
      coverImage:
        portraitPool[(year + uni.id.length) % portraitPool.length],
      status: year === 2026 ? 'launched' : 'sealed',
      graduatesCount: count,
      sealedAt: year < 2026 ? `${year}-07-15` : undefined,
    });
  });
});

export const demoUniversities = universities;
export const demoClasses = allClasses;
export const demoGraduates = allGraduates;

export function getUniversityBySlug(slug: string) {
  return demoUniversities.find((u) => u.slug === slug) ?? null;
}
export function getClassesForUniversity(uniId: string) {
  return demoClasses
    .filter((c) => c.universityId === uniId)
    .sort((a, b) => b.year - a.year);
}
export function getGraduatesForClass(uniId: string, year: number) {
  return demoGraduates.filter(
    (g) => g.universityId === uniId && g.year === year
  );
}
export function getGraduateById(id: string) {
  return demoGraduates.find((g) => g.id === id) ?? null;
}
export function searchGraduates(q: string) {
  if (!q.trim()) return demoGraduates.slice(0, 20);
  const needle = q.toLowerCase();
  return demoGraduates
    .filter(
      (g) =>
        g.fullName.toLowerCase().includes(needle) ||
        g.universityName.toLowerCase().includes(needle) ||
        g.departmentName.toLowerCase().includes(needle) ||
        String(g.year).includes(needle)
    )
    .slice(0, 60);
}
