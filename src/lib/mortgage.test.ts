import { describe, expect, it } from "vitest";
import { calculateMortgage } from "./mortgage";

describe("calculateMortgage", () => {
  it("splits an interest-free loan evenly", () => {
    const result = calculateMortgage({
      housePrice: 120_000,
      depositPercent: 0,
      annualRatePercent: 0,
      termYears: 10,
    });
    expect(result.loan).toBe(120_000);
    expect(result.monthlyRepayment).toBe(1_000);
  });

  it("computes deposit from a percentage", () => {
    const result = calculateMortgage({
      housePrice: 280_000,
      depositPercent: 10,
      annualRatePercent: 4.5,
      termYears: 30,
    });
    expect(result.deposit).toBe(28_000);
    expect(result.loan).toBe(252_000);
    expect(result.monthlyRepayment).toBeGreaterThan(1_200);
    expect(result.monthlyRepayment).toBeLessThan(1_400);
  });
});
