import { describe, it, expect } from "vitest";
import {
  activityQuerySchema,
  activityParamsSchema,
} from "../schemas/activities-schemas.js";
import {
  createPlanSchema,
  updatePlanSchema,
  planParamsSchema,
} from "../schemas/plans-schemas.js";

describe("activityQuerySchema", () => {
  it("parses empty query", () => {
    const result = activityQuerySchema.parse({});
    expect(result).toEqual({ page: 1, limit: 20 });
  });

  it("parses search query", () => {
    const result = activityQuerySchema.parse({ q: "art", category: "Culture" });
    expect(result.q).toBe("art");
    expect(result.category).toBe("Culture");
  });

  it("coerces page and limit", () => {
    const result = activityQuerySchema.parse({ page: "2", limit: "10" });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
  });
});

describe("activityParamsSchema", () => {
  it("accepts valid id", () => {
    const result = activityParamsSchema.parse({ id: "act_001" });
    expect(result.id).toBe("act_001");
  });

  it("rejects empty id", () => {
    expect(() => activityParamsSchema.parse({ id: "" })).toThrow();
  });
});

describe("createPlanSchema", () => {
  it("accepts valid input", () => {
    const result = createPlanSchema.parse({
      name: "My Plan",
      date: "2026-06-20",
      activityIds: ["act_001"],
    });
    expect(result.name).toBe("My Plan");
    expect(result.activityIds).toEqual(["act_001"]);
  });

  it("rejects empty name", () => {
    expect(() =>
      createPlanSchema.parse({
        name: "",
        date: "2026-06-20",
        activityIds: ["act_001"],
      }),
    ).toThrow("Name is required");
  });

  it("rejects missing name", () => {
    expect(() =>
      createPlanSchema.parse({
        date: "2026-06-20",
        activityIds: ["act_001"],
      }),
    ).toThrow();
  });

  it("rejects invalid date", () => {
    expect(() =>
      createPlanSchema.parse({
        name: "Plan",
        date: "not-a-date",
        activityIds: ["act_001"],
      }),
    ).toThrow("Date must be valid");
  });

  it("rejects empty activityIds", () => {
    expect(() =>
      createPlanSchema.parse({
        name: "Plan",
        date: "2026-06-20",
        activityIds: [],
      }),
    ).toThrow("At least one activity is required");
  });

  it("accepts optional notes", () => {
    const result = createPlanSchema.parse({
      name: "Plan",
      date: "2026-06-20",
      activityIds: ["act_001"],
      notes: "Evening free",
    });
    expect(result.notes).toBe("Evening free");
  });
});

describe("updatePlanSchema", () => {
  it("accepts partial update", () => {
    const result = updatePlanSchema.parse({ name: "New Name" });
    expect(result.name).toBe("New Name");
  });

  it("rejects empty body", () => {
    expect(() => updatePlanSchema.parse({})).toThrow(
      "At least one field is required",
    );
  });
});

describe("planParamsSchema", () => {
  it("accepts valid id", () => {
    const result = planParamsSchema.parse({ id: "plan_001" });
    expect(result.id).toBe("plan_001");
  });

  it("rejects empty id", () => {
    expect(() => planParamsSchema.parse({ id: "" })).toThrow();
  });
});
