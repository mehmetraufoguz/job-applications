import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/jobApplications.schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  driver: 'pglite',
  dbCredentials: {
    url: './pglite'
  }
});
