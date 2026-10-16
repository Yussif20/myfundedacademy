import { beforeEach, describe, expect, it, vi } from "vitest";

// Fake Stripe + database: these tests never reach the network.
const stripeApi = vi.hoisted(() => {
  process.env.STRIPE_SECRET_KEY = "sk_test_unit";
  return { customers: { retrieve: vi.fn(), create: vi.fn() } };
});
const db = vi.hoisted(() => ({ user: { update: vi.fn() } }));
vi.mock("stripe", () => ({ default: vi.fn(() => stripeApi) }));
vi.mock("@/lib/db/db", () => ({ prisma: db, insecurePrisma: db }));

import { getOrCreateCustomer, stripeProductImages } from "@/lib/payments/stripe";

describe("stripeProductImages", () => {
  it("passes absolute https raster images through", () => {
    expect(stripeProductImages("https://cdn.example.com/c/thumb.jpg")).toEqual(["https://cdn.example.com/c/thumb.jpg"]);
  });

  it("drops what Stripe rejects: relative paths, SVG, plain http, empty", () => {
    expect(stripeProductImages("/demo/courses/demo-html-css-basics.svg")).toBeUndefined();
    expect(stripeProductImages("https://cdn.example.com/c/thumb.SVG")).toBeUndefined();
    expect(stripeProductImages("http://cdn.example.com/c/thumb.png")).toBeUndefined();
    expect(stripeProductImages("")).toBeUndefined();
    expect(stripeProductImages(null)).toBeUndefined();
  });
});

describe("getOrCreateCustomer", () => {
  const user = { id: "u1", email: "learner@example.com", fullName: "Learner", stripeCustomerId: "cus_old" };

  beforeEach(() => {
    vi.clearAllMocks();
    stripeApi.customers.create.mockResolvedValue({ id: "cus_new" });
  });

  it("reuses a stored customer that still exists", async () => {
    stripeApi.customers.retrieve.mockResolvedValue({ id: "cus_old", deleted: false });
    await expect(getOrCreateCustomer(user)).resolves.toBe("cus_old");
    expect(stripeApi.customers.create).not.toHaveBeenCalled();
  });

  it("replaces a stored id from another Stripe account", async () => {
    stripeApi.customers.retrieve.mockRejectedValue(Object.assign(new Error("No such customer"), { code: "resource_missing" }));
    await expect(getOrCreateCustomer(user)).resolves.toBe("cus_new");
    expect(db.user.update).toHaveBeenCalledWith({ where: { id: "u1" }, data: { stripeCustomerId: "cus_new" } });
  });

  it("replaces a deleted customer", async () => {
    stripeApi.customers.retrieve.mockResolvedValue({ id: "cus_old", deleted: true });
    await expect(getOrCreateCustomer(user)).resolves.toBe("cus_new");
  });

  it("does not swallow other Stripe errors", async () => {
    stripeApi.customers.retrieve.mockRejectedValue(Object.assign(new Error("rate limited"), { code: "rate_limit" }));
    await expect(getOrCreateCustomer(user)).rejects.toThrow("rate limited");
    expect(stripeApi.customers.create).not.toHaveBeenCalled();
  });
});
