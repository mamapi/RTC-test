import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { server, init } from "../src";

describe("index", () => {
  it("should run test", () => {
    expect(true).toBe(true);
  });
});

describe("Server tests", () => {
  beforeEach(async () => {
    await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  it("server initializes correctly", async () => {
    expect(server).toBeDefined();
    expect(server.settings.port).toBe(4000);
    expect(server.settings.host).toBe("localhost");
  });

  it("server handles environment port variable", async () => {
    process.env.PORT = "4001";

    await server.stop();
    const newServer = await init();

    expect(newServer.settings.port).toBe(4001);
    delete process.env.PORT;
  });
});
