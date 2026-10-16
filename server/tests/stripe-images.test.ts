import { describe, expect, it } from "vitest";
import { stripeProductImages } from "@/lib/payments/stripe";

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
