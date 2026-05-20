/**
 * CANONICAL SCHEMA — nested.
 *
 * Graduates live at: universities/{uniId}/classes/{classId}/graduates/{gradId}
 * Sub-collections:    .../graduates/{gradId}/memories/{memoryId}
 *                     .../graduates/{gradId}/goodwills/{goodwillId}
 *
 * The graduate doc denormalises universityId/schoolId/classId/year/
 * universityName/schoolName/departmentName so collection-group queries
 * (used by /search and global feeds) need no joins.
 *
 * Top-level `graduates/{id}` is NOT the canonical path. If you see writes
 * to it, fix them to use the nested path above.
 */
import { z } from 'zod';

export const visibilitySchema = z.enum(['public', 'connections', 'private']);
export type Visibility = z.infer<typeof visibilitySchema>;

export const graduateStatusSchema = z.enum([
  'draft',
  'pending_review',
  'approved',
  'sealed',
]);
export type GraduateStatus = z.infer<typeof graduateStatusSchema>;

export const roleSchema = z.enum([
  'visitor',
  'student',
  'alumni',
  'rep',
  'university_admin',
  'official',
  'superadmin',
]);
export type Role = z.infer<typeof roleSchema>;

export const universitySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  city: z.string(),
  country: z.string(),
  motto: z.string().optional(),
  coverImage: z.string().url().optional(),
  crestImage: z.string().url().optional(),
  branding: z
    .object({
      primary: z.string().default('#0B0B0F'),
      accent: z.string().default('#B8854A'),
    })
    .partial()
    .optional(),
  graduatesCount: z.number().int().default(0),
  classesCount: z.number().int().default(0),
});
export type University = z.infer<typeof universitySchema>;

export const classSchema = z.object({
  id: z.string(),
  universityId: z.string(),
  year: z.number().int(),
  theme: z.string().optional(),
  coverImage: z.string().url().optional(),
  status: z.enum(['open', 'review', 'launched', 'sealed']),
  graduatesCount: z.number().int().default(0),
  sealedAt: z.string().optional(),
});
export type ClassYear = z.infer<typeof classSchema>;

export const memorySchema = z.object({
  id: z.string(),
  title: z.string().max(80),
  body: z.string().max(800),
  imageUrl: z.string().url().optional(),
  createdAt: z.string(),
});
export type Memory = z.infer<typeof memorySchema>;

export const goodwillSchema = z.object({
  id: z.string(),
  fromName: z.string().max(60),
  fromRelation: z.string().max(40).optional(),
  message: z.string().max(400),
  approved: z.boolean().default(false),
  createdAt: z.string(),
});
export type Goodwill = z.infer<typeof goodwillSchema>;

export const graduateSchema = z.object({
  id: z.string(),
  uid: z.string().nullable(),
  universityId: z.string(),
  schoolId: z.string(),
  departmentId: z.string(),
  classId: z.string(),
  fullName: z.string(),
  preferredName: z.string().optional(),
  portraitUrl: z.string().url(),
  showcaseClipUrl: z.string().url().optional(),
  bio: z.string().max(600).optional(),
  quote: z.string().max(200).optional(),
  socials: z
    .object({
      instagram: z.string().optional(),
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
    })
    .optional(),
  visibility: z.object({
    bio: visibilitySchema.default('public'),
    contact: visibilitySchema.default('private'),
    memories: visibilitySchema.default('public'),
  }),
  schoolName: z.string(),
  departmentName: z.string(),
  universityName: z.string(),
  year: z.number().int(),
  status: graduateStatusSchema,
  memories: z.array(memorySchema).default([]),
  goodwills: z.array(goodwillSchema).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
  sealedAt: z.string().optional(),
});
export type Graduate = z.infer<typeof graduateSchema>;

export const goodwillInputSchema = z.object({
  graduateId: z.string(),
  fromName: z.string().min(2).max(60),
  fromRelation: z.string().max(40).optional(),
  message: z.string().min(8).max(400),
});
export type GoodwillInput = z.infer<typeof goodwillInputSchema>;

export const repSignupSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  universityName: z.string().min(2),
  role: z.string().min(2),
  phone: z.string().optional(),
});
export type RepSignup = z.infer<typeof repSignupSchema>;
