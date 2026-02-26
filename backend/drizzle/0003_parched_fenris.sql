CREATE TABLE "Image" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"image_url" varchar(255) NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Image" ADD CONSTRAINT "Image_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;