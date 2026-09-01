import { describe, expect, it } from "vitest";
import {
  calculateTakeHome,
  personalAllowanceFromTaxCode,
  taperedPersonalAllowance,
} from "./uk-tax";

describe("personalAllowanceFromTaxCode", () => {
  it("parses 1257L as £12,570", () => {
    expect(personalAllowanceFromTaxCode("1257L")).toBe(12_570);
  });

  it("rejects unsupported codes", () => {
    expect(personalAllowanceFromTaxCode("BR")).toBeNull();
    expect(personalAllowanceFromTaxCode("")).toBeNull();
  });
});

describe("taperedPersonalAllowance", () => {
  it("is unchanged at £100,000", () => {
    expect(taperedPersonalAllowance(12_570, 100_000)).toBe(12_570);
  });

  it("loses £1 for every £2 over £100,000", () => {
    expect(taperedPersonalAllowance(12_570, 110_000)).toBe(7_570);
  });

  it("is nil by £125,140", () => {
    expect(taperedPersonalAllowance(12_570, 125_140)).toBe(0);
  });
});

describe("calculateTakeHome", () => {
  const base = {
    taxCode: "1257L",
    region: "ruk" as const,
    studentLoan: "none" as const,
    pensionPercent: 0,
  };

  it("labels the estimate as 2026/27", () => {
    const result = calculateTakeHome({ ...base, annualGross: 35_000 });
    expect(result.taxYear).toBe("2026/27");
  });

  it("estimates £35,000 rUK with no pension or student loan", () => {
    const result = calculateTakeHome({ ...base, annualGross: 35_000 });
    expect(result.incomeTax).toBeCloseTo(4_486, 2);
    expect(result.employeeNI).toBeCloseTo(1_794.4, 2);
    expect(result.annualTakeHome).toBeCloseTo(28_719.6, 2);
    expect(result.monthlyTakeHome).toBeCloseTo(2_393.3, 2);
  });

  it("charges more income tax in Scotland than rUK at £35,000", () => {
    const ruk = calculateTakeHome({ ...base, annualGross: 35_000 });
    const scotland = calculateTakeHome({
      ...base,
      annualGross: 35_000,
      region: "scotland",
    });
    expect(scotland.incomeTax).toBeGreaterThan(ruk.incomeTax);
    expect(scotland.incomeTax).toBeCloseTo(4_501.07, 2);
  });

  it("applies personal allowance taper at £110,000", () => {
    const result = calculateTakeHome({ ...base, annualGross: 110_000 });
    expect(result.personalAllowance).toBe(7_570);
    expect(result.incomeTax).toBeCloseTo(33_432, 2);
  });

  it("deducts Plan 2 student loan above the threshold", () => {
    const result = calculateTakeHome({
      ...base,
      annualGross: 35_000,
      studentLoan: "plan2",
    });
    expect(result.studentLoan).toBeCloseTo(505.35, 2);
  });

  it("treats pension as salary sacrifice (reduces tax and NI)", () => {
    const result = calculateTakeHome({
      ...base,
      annualGross: 35_000,
      pensionPercent: 5,
    });
    expect(result.pension).toBeCloseTo(1_750, 2);
    expect(result.incomeTax).toBeCloseTo(4_136, 2);
    expect(result.employeeNI).toBeCloseTo(1_654.4, 2);
    expect(result.annualTakeHome).toBeCloseTo(27_459.6, 2);
  });
});
