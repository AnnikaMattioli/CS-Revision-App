import { describe, expect, it } from "vitest";
import { aqaGcseBlueprints } from "./aqa-gcse";
import { AQA_GCSE_ENRICHMENT } from "./aqa-gcse-enrichment";

describe("AQA GCSE stable specification coverage", () => {
  it("enriches every lesson with an example, misconception and exam tip", () => {
    const units = aqaGcseBlueprints.flatMap((topic) => topic.units);
    expect(Object.keys(AQA_GCSE_ENRICHMENT)).toHaveLength(units.length);
    for (const unit of units) {
      const enrichment = AQA_GCSE_ENRICHMENT[unit.slug];
      expect(enrichment?.workedExample.length).toBeGreaterThan(45);
      expect(enrichment?.misconception.length).toBeGreaterThan(40);
      expect(enrichment?.examTip.length).toBeGreaterThan(35);
    }
  });

  it("contains easily omitted AQA 8525 requirements", () => {
    const content = JSON.stringify(aqaGcseBlueprints).toLowerCase();
    for (const required of ["inputs", "merge sort", "substring", "huffman", "run-length", "xor", "pan", "tcp/ip", "blagging", "spyware", "captcha", "foreign key", "order by"]) {
      expect(content).toContain(required);
    }
    expect(content).not.toContain("insertion sort");
    expect(content).not.toContain("space efficiency");
  });
});
