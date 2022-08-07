import { PrismaClient } from "@prisma/client";
import express from "express";
import env from "./config";

const app = express();

app.get("/posts", async (req, res) => {
  const authorId = Number.parseInt(req.query.authorId as string);

  // for demonstration, initialize outside of request scope
  const client = new PrismaClient({
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
  });

  const posts = await client.post.findMany({
    select: {
      author: {
        select: {
          name: true,
        },
      },
      title: true,
      content: true,
      published: true,
    },
    where: {
      authorId,
    },
  });

  res.status(200).json({ data: posts });
});

export default app;
