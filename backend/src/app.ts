import express from "express";
import { drizzle } from "drizzle-orm/node-postgres";

const app = express();
const port = process.env.PORT ?? "3000";
const db = drizzle(process.env.DATABASE_URL!);

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
