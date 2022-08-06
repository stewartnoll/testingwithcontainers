import { Client } from "pg";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "testcontainers";

describe("postgres", () => {
  jest.setTimeout(180_000); // needed for first download of container image
  let container: StartedPostgreSqlContainer;
  let client: Client;

  beforeAll(async () => {
    container = await new PostgreSqlContainer("postgres:13.3-alpine").start();

    client = new Client({
      host: container.getHost(),
      port: container.getPort(),
      database: container.getDatabase(),
      user: container.getUsername(),
      password: container.getPassword(),
    });
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
    await container.stop();
  });

  it("works", async () => {
    const result = await client.query("SELECT 1");
    expect(result.rows[0]).toEqual({ "?column?": 1 });
  });
});
