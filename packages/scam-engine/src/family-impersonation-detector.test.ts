import { describe, expect, it } from "vitest";

import { detectFamilyImpersonation } from "./family-impersonation-detector";

describe("detectFamilyImpersonation", () => {
  it("detects a new-number family impersonation pattern", () => {
    const signal = detectFamilyImpersonation({
      channel: "sms",
      text: "Hi Mum, this is my new number. My old phone broke. Can you message me on WhatsApp?",
    });

    expect(signal?.code).toBe("FAMILY_IMPERSONATION");
    expect(signal?.severity).toBe("medium");
    expect(signal?.scoreContribution).toBe(25);
  });

  it("detects a similar Hi Dad pattern", () => {
    const signal = detectFamilyImpersonation({
      channel: "sms",
      text: "Hi Dad, this is my new number. I lost my phone. Please message me here.",
    });

    expect(signal?.code).toBe("FAMILY_IMPERSONATION");
  });

  it("does not flag an ordinary family message", () => {
    const signal = detectFamilyImpersonation({
      channel: "sms",
      text: "Hi Mum, I'll be home around 8 tonight. See you then.",
    });

    expect(signal).toBeUndefined();
  });

  it("does not flag a simple phone problem without family impersonation context", () => {
    const signal = detectFamilyImpersonation({
      channel: "sms",
      text: "My phone broke today so I need to get it repaired.",
    });

    expect(signal).toBeUndefined();
  });

  it("does not flag a family greeting with only one weak contextual clue", () => {
    const signal = detectFamilyImpersonation({
      channel: "sms",
      text: "Hi Mum, message me when you get home.",
    });

    expect(signal).toBeUndefined();
  });

  it("returns no signal for empty input", () => {
    expect(
      detectFamilyImpersonation({
        channel: "unknown",
        text: "",
      }),
    ).toBeUndefined();
  });
});