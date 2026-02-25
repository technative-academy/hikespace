import express from "express";
import { drizzle } from "drizzle-orm/node-postgres";

const app = express();
const port = process.env.PORT ?? "3000";
const db = drizzle(process.env.DATABASE_URL!);

app.get("/", (_req, res) => {
  res.send("Hello from Express");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
