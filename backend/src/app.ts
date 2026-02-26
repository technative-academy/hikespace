import express from "express";
import swaggerUi from "swagger-ui-express";
import { openapiDocument } from "./openapi.js";
import { drizzle } from "drizzle-orm/node-postgres";
import userRouter from "#modules/user/user.router.js";

const app = express();
app.use(express.json());
const port = process.env.PORT ?? "3000";

app.get("/openapi.json", (_req, res) => res.json(openapiDocument));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

app.use("/users", userRouter);

app.get("/", (_req, res) => {
  res.send("Hello from Express");
});

app.get("/posts", (req, res) => {
  res.send([
    {
      post_id: 1,
      owner_id: 1,
      description: "walking in Brighton!",
      route: [[50.828873], [-0.141176]],
      location_name: "Brighton",
      caption: "hi, this is a post about walking in Brighton!"
    }
  ]);
});

app.get("/posts/:id", (req, res) => {
  res.send({
    post_id: parseInt(req.params.id),
    owner_id: 1,
    description: "walking in Brighton!",
    route: [[50.828873], [-0.141176]],
    location_name: "Brighton",
    caption: "hi, this is a post about walking in Brighton!"
  });
});

app.post("/upload", (req, res) => {
  res.status(200).send({ status: "OK" });
});

app.put("/update/:id", (req, res) => {
  res.status(200).send({ post_id: parseInt(req.params.id), status: "OK" });
});

app.delete("/delete/:id", (req, res) => {
  res.status(200).send({ post_id: parseInt(req.params.id), status: "OK" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
