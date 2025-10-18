CREATE TABLE IF NOT EXISTS "readings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"ai_result" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);