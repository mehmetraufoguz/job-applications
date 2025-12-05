import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { jobApplications } from './jobApplications.schema.js';

const db = new PGlite({ dataDir: "./pglite" });
export const orm = drizzle(db, { schema: { jobApplications } });
