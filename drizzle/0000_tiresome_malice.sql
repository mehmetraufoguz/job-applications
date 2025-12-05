CREATE TABLE "job_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"link" text NOT NULL,
	"platform" varchar(100) NOT NULL,
	"status" varchar(50) NOT NULL
);
