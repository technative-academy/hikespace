ALTER TABLE "post" DROP COLUMN "path";

ALTER TABLE "post"
ADD COLUMN "path" geometry(LineString, 4326) NOT NULL;