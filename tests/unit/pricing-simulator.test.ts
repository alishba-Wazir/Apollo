import { describe, it, expect } from "vitest";

/**
 * Formula test for Pricing Simulator Churn Elasticity & Projected MRR
 */
describe("Pricing Simulator Elasticity & MRR Engine", () => {
  const currentBasePrice = 149;
  const activeMembers = 2410;
  const currentMRR = activeMembers * currentBasePrice; // $359,090

  const calculateProjectedMRR = (newPrice: number) => {
    const priceDelta = newPrice - currentBasePrice;
    const priceChangePct = priceDelta / currentBasePrice;

    // Churn elasticity factor: 0.42% churn per 1% price increase
    const churnPct = priceDelta > 0 ? priceChangePct * 0.42 : priceChangePct * 0.15;
    const projectedMembers = Math.round(activeMembers * (1 - churnPct));
    const projectedMRR = projectedMembers * newPrice;
    const netMRRDelta = projectedMRR - currentMRR;

    return {
      projectedMembers,
      projectedMRR,
      netMRRDelta,
      churnPct: Math.round(churnPct * 1000) / 10,
    };
  };

  it("should match baseline MRR when price is unchanged ($149)", () => {
    const result = calculateProjectedMRR(149);
    expect(result.projectedMembers).toBe(2410);
    expect(result.projectedMRR).toBe(currentMRR);
    expect(result.netMRRDelta).toBe(0);
    expect(result.churnPct).toBe(0);
  });

  it("should project positive net MRR despite minor churn on moderate price increase ($169)", () => {
    const result = calculateProjectedMRR(169);
    expect(result.projectedMembers).toBeLessThan(activeMembers);
    expect(result.projectedMembers).toBeGreaterThan(2250);
    expect(result.projectedMRR).toBeGreaterThan(currentMRR);
    expect(result.netMRRDelta).toBeGreaterThan(0);
  });

  it("should protect against extreme pricing scenarios ($250)", () => {
    const result = calculateProjectedMRR(250);
    expect(result.churnPct).toBeGreaterThan(20); // High churn warning
    expect(result.projectedMembers).toBeLessThan(1900);
  });
});
