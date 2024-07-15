CREATE TABLE IF NOT EXISTS "user_credentials" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"credentials" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(70),
	"date_of_birth" date
);
