import { describe, expect, it } from "vitest";
import { ocrGcseBlueprints } from "./ocr-gcse";
import { OCR_GCSE_ENRICHMENT } from "./ocr-gcse-enrichment";

describe("OCR GCSE 2026 specification coverage", () => {
  it("enriches every lesson with an example, misconception and exam tip", () => {
    const units = ocrGcseBlueprints.flatMap((topic) => topic.units);
    expect(Object.keys(OCR_GCSE_ENRICHMENT)).toHaveLength(units.length);
    for (const unit of units) {
      const enrichment = OCR_GCSE_ENRICHMENT[unit.slug];
      expect(enrichment?.workedExample.length).toBeGreaterThan(45);
      expect(enrichment?.misconception.length).toBeGreaterThan(40);
      expect(enrichment?.examTip.length).toBeGreaterThan(35);
    }
  });

  it("contains critical J277 details that are easy to omit", () => {
    const content = JSON.stringify(ocrGcseBlueprints).toLowerCase();
    for (const required of ["program counter", "hexadecimal", "metadata", "pop", "mac", "data protection act 2018", "structure diagram", "erroneous", "select", "compiler", "interpreter"]) {
      expect(content).toContain(required);
    }
  });
});
