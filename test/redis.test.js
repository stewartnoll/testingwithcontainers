const redis = require("async-redis");
const { GenericContainer } = require("testcontainers");

describe("redis", () => {
  jest.setTimeout(180_000); // needed for first download of container image
  let container;
  let redisClient;

  beforeAll(async () => {
    container = await new GenericContainer("redis")
      .withExposedPorts(6379)
      .start();

    const stream = await container.logs();
    stream
      .on("data", (line) => console.log(line))
      .on("err", (line) => console.error(line))
      .on("end", () => console.log("Stream closed"));

    redisClient = redis.createClient(
      container.getMappedPort(6379),
      container.getHost()
    );
  });

  afterAll(async () => {
    await redisClient.quit();
    await container.stop();
  });

  it("works", async () => {
    await redisClient.set("key", "val");
    expect(await redisClient.get("key")).toBe("val");
  });
});
