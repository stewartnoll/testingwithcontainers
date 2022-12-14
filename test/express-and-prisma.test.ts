import { PrismaClient } from "@prisma/client";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "testcontainers";
import { execSync } from "child_process";
import app from "../src/app";
import request from "supertest";
import env from "../src/config";

describe("express and prisma", () => {
  jest.setTimeout(180_000); // needed for first download of pg image
  let container: StartedPostgreSqlContainer;
  let client: PrismaClient;

  beforeAll(async () => {
    container = await new PostgreSqlContainer("postgres:13.3-alpine").start();
    const dbUrl = `postgresql://${container.getUsername()}:${container.getPassword()}@${container.getHost()}:${container.getPort()}/${container.getDatabase()}`;
    // initialize containerized db schema from prisma migrations
    execSync(
      `export DATABASE_URL=${dbUrl} && npx prisma migrate dev --name init`,
      { stdio: "inherit" }
    );

    client = new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
    // configure env variable with containerized db url
    env.DATABASE_URL = dbUrl;
  });

  afterAll(async () => {
    await client.$disconnect();
    await container.stop();
  });

  it("works", async () => {
    // arrange / seed the db
    const user = await client.user.create({
      data: {
        name: "Bob",
        email: "bob@prisma.io",
        posts: {
          create: {
            title: "Hello World",
          },
        },
      },
    });
    await client.post.create({
      data: {
        title: "Another post",
        content: "This is my first post",
        published: true,
        authorId: user.id,
      },
    });

    // act
    const response = await request(app)
      .get(`/posts?authorId=${user.id}`)
      .set("Accept", "application/json");

    // assert
    const posts = response.body.data;
    expect(posts.length).toBe(2);
    expect(posts[0].author.name).toBe("Bob");
  });
});
