import { z } from "zod";
import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageTyped } from "./index";
class LocalStorageMock {
  store: Record<string, string> = {};
  clear = () => {
    this.store = {};
  };
  getItem = (key: string) => this.store[key] ?? null;
  setItem = (key: string, value: string) => {
    this.store[key] = value;
  };
  removeItem = (key: string) => {
    delete this.store[key];
  };
  key = (i: number) => Object.keys(this.store)[i] ?? null;
  get length() {
    return Object.keys(this.store).length;
  }
}

(globalThis as any).localStorage = new LocalStorageMock();

const schema = {
  user: z.object({
    id: z.string(),
    name: z.string(),
  }),
  count: z.number(),
};

describe("LocalStorageTyped", () => {
  let store: LocalStorageTyped<typeof schema>;

  beforeEach(() => {
    localStorage.clear();
    store = new LocalStorageTyped(schema);
  });

  it("should set and get a valid user", () => {
    store.set("user", { id: "1", name: "Alice" });
    const user = store.get("user");
    expect(user).toEqual({ id: "1", name: "Alice" });
  });

  it("should return null for invalid JSON", () => {
    localStorage.setItem("user", "{not json}");
    const user = store.get("user");
    expect(user).toBeNull();
  });

  it("should remove a key", () => {
    store.set("count", 42);
    store.remove("count");
    expect(store.get("count")).toBeNull();
  });

  it("should clear all defined keys", () => {
    store.set("count", 5);
    store.set("user", { id: "2", name: "Bob" });
    store.clear();
    expect(store.get("count")).toBeNull();
    expect(store.get("user")).toBeNull();
  });

  it("should not allow invalid data", () => {
    // @ts-expect-error - invalid data
    expect(() => store.set("count", "not a number")).toThrow();
  });
});
