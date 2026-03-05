import express from "express";
import swaggerUi from "swagger-ui-express";
import { openapiDocument } from "./openapi.js";
import { drizzle } from "drizzle-orm/node-postgres";
import userRouter from "#modules/user/user.router.js";
import postRouter from "#modules/post/post.router.js";
import participRouter from "#modules/participation/particip.router.js";
import imageRouter from "#modules/image/image.router.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "#utils/auth.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.SWAGGER_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

const port = process.env.PORT ?? "3000";

app.get("/openapi.json", (_req, res) => res.json(openapiDocument));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/participations", participRouter);
app.use("/images", imageRouter);

app.get("/", (_req, res) => {
  res.send("Hello from Express");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
