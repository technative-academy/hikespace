CREATE TABLE "post" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" integer NOT NULL,
	"description" text NOT NULL,
	"path" geometry(point) NOT NULL,
	"location_name" varchar(255) NOT NULL,
	"caption" varchar(100) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;