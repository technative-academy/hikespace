CREATE TABLE "image" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"image_url" varchar(255) NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
DROP TABLE "Image" CASCADE;--> statement-breakpoint
ALTER TABLE "image" ADD CONSTRAINT "image_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;