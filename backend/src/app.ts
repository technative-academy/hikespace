import express from "express";
import swaggerUi from "swagger-ui-express";
import { openapiDocument } from "./openapi.js";
import userRouter from "#modules/user/user.router.js";
import { mockAuth } from "./middleware/mock-auth.js";
import postRouter from "#modules/post/post.router.js";
import participRouter from "#modules/participation/particip.router.js";
import imageRouter from "#modules/image/image.router.js";
import likeRouter from "#modules/like/like.router.js";
import followRouter from "#modules/following/follow.router.js";

const app = express();
app.use(express.json());
app.use(mockAuth);
const port = process.env.PORT ?? "3000";

app.get("/openapi.json", (_req, res) => res.json(openapiDocument));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/participations", participRouter);
app.use("/images", imageRouter);
app.use("/likes", likeRouter);
app.use("/follows", followRouter);

app.get("/", (_req, res) => {
  res.send("Hello from Express");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
