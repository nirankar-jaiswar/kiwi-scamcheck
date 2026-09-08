import { describe, expect, it } from "vitest";

import { evaluationMessages } from "../../test-data/messages";
import { analyseMessage } from "./index";

describe("evaluation dataset", () => {
  for (const message of evaluationMessages) {
    it(message.id, () => {
      const result = analyseMessage({
        text: message.text,
        channel: message.channel,
      });

      expect(result.riskLevel).toBe(message.expectedRisk);

      const actualSignals = result.signals
        .map((signal) => signal.code)
        .sort();

      const expectedSignals = [...message.expectedSignals].sort();

      expect(actualSignals).toEqual(expectedSignals);
    });
  }
});