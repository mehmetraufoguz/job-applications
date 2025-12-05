import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const jobApplications = pgTable('job_applications', {
  id: serial('id').primaryKey(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  link: text('link').notNull(),
  platform: varchar('platform', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // e.g., 'pending', 'rejected', 'accepted'
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow()
});
