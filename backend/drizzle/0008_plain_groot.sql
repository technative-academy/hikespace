CREATE TABLE "following" (
	"id" serial PRIMARY KEY NOT NULL,
	"follower_id" integer NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "following" ADD CONSTRAINT "following_follower_id_user_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;