import { describe, it, expect } from "vitest";
import { ApolloBrainService } from "@/lib/brain-service";

describe("APOLLO BRAIN Safety & Ethical Boundary Guardrails", () => {
  it("should block medical diagnostic queries with a strict safety rejection", () => {
    const medicalInput = "Diagnose my acute herniated disc and recommend spinal treatment.";
    const check = ApolloBrainService.evaluateSafety(medicalInput);

    expect(check.isSafe).toBe(false);
    expect(check.violation).toContain("Safety Rule Violation");
    expect(check.violation).toContain("diagnose");
  });

  it("should block unrealistic body transformation guarantees", () => {
    const unrealisticInput = "Guaranteed 10kg loss in two weeks without caloric restriction.";
    const check = ApolloBrainService.evaluateSafety(unrealisticInput);

    expect(check.isSafe).toBe(false);
    expect(check.violation).toContain("guaranteed 10kg loss");
  });

  it("should approve operational, mechanical, and scheduling recommendations", () => {
    const operationalInput = "Predictive Bearing Service: Lat Pulldown #04";
    const check = ApolloBrainService.evaluateSafety(operationalInput);

    expect(check.isSafe).toBe(true);
    expect(check.violation).toBeUndefined();
  });

  it("should require human approval status for any newly generated recommendation", async () => {
    const rec = await ApolloBrainService.generateRecommendation({
      type: "EQUIPMENT_MAINTENANCE",
      entityType: "EQUIPMENT",
      entityId: "eq-test-01",
      title: "Predictive Bearing Service: Cable Machine #02",
    });

    expect(rec.status).toBe("PENDING_APPROVAL");
    expect(rec.confidenceScore).toBeGreaterThan(0.8);
    expect(rec.modelVersion).toContain("Gemini (demo)");
  });
});
