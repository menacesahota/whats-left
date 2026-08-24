import { describe, expect, it } from "vitest";
import { calculatePayoff } from "./debt";

describe("calculatePayoff", () => {
  it("pays the highest APR first with avalanche", () => {
    const result = calculatePayoff(
      [
        {
          id: "a",
          name: "Card",
          balance: 1_000,
          apr: 20,
          minPayment: 50,
        },
        {
          id: "b",
          name: "Loan",
          balance: 1_000,
          apr: 5,
          minPayment: 50,
        },
      ],
      "avalanche",
      0,
    );
    expect(result.cleared).toBe(true);
    expect(result.order[0]).toBe("Card");
  });

  it("pays the smallest balance first with snowball", () => {
    const result = calculatePayoff(
      [
        {
          id: "a",
          name: "Small",
          balance: 200,
          apr: 5,
          minPayment: 20,
        },
        {
          id: "b",
          name: "Large",
          balance: 2_000,
          apr: 20,
          minPayment: 50,
        },
      ],
      "snowball",
      0,
    );
    expect(result.order[0]).toBe("Small");
  });
});
