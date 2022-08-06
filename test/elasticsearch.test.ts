import {
  ElasticsearchContainer,
  StartedElasticsearchContainer,
} from "testcontainers";
import { Client } from "@elastic/elasticsearch";

describe("ElasticsearchContainer", () => {
  jest.setTimeout(180_000);
  let container: StartedElasticsearchContainer;
  let client: Client;

  beforeEach(async () => {
    container = await new ElasticsearchContainer(
      "docker.elastic.co/elasticsearch/elasticsearch:7.9.2"
    ).start();
    client = new Client({ node: container.getHttpUrl() });
  });

  afterEach(async () => {
    await container.stop();
  });

  it("should connect to http node of elasticsearch instance and create an index", async () => {
    await client.indices.create({ index: "people" });

    expect((await client.indices.exists({ index: "people" })).statusCode).toBe(
      200
    );
  });

  it("should index a document in elasticsearch", async () => {
    const document = {
      id: "1",
      name: "John Doe",
    };
    await client.index({
      index: "people",
      body: document,
      id: document.id,
    });

    expect(
      (await client.get({ index: "people", id: document.id })).body._source
    ).toStrictEqual(document);
  });
});
