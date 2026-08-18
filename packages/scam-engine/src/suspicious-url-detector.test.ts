import { describe, expect, it } from "vitest";

import type { ScamAnalysisInput } from "@kiwi-scamcheck/contracts";

import { analyseMessage } from "./index";
import { detectSuspiciousUrl } from "./suspicious-url-detector";

function input(text: string): ScamAnalysisInput {
  return { text, channel: "unknown" };
}

describe("detectSuspiciousUrl", () => {
  it("detects a bit.ly link", () => {
    expect(
      detectSuspiciousUrl(input("Visit https://bit.ly/account-check")),
    ).toEqual({
      code: "SUSPICIOUS_URL",
      title: "Suspicious link detected",
      explanation:
        "The message contains a link with characteristics commonly used to disguise its destination.",
      severity: "high",
      evidence: ["https://bit.ly/account-check"],
      scoreContribution: 25,
    });
  });

  it("detects another URL shortener", () => {
    expect(
      detectSuspiciousUrl(input("Open http://tinyurl.com/check-now"))?.evidence,
    ).toEqual(["http://tinyurl.com/check-now"]);
  });

  it("detects an IP-address URL", () => {
    expect(
      detectSuspiciousUrl(input("Sign in at https://192.168.1.20/login"))
        ?.evidence,
    ).toEqual(["https://192.168.1.20/login"]);
  });

  it("detects a URL containing embedded credentials", () => {
    expect(
      detectSuspiciousUrl(input("Open https://user@example.com/secure"))
        ?.evidence,
    ).toEqual(["https://user@example.com/secure"]);
  });

  it("does not flag a normal HTTPS URL", () => {
    expect(
      detectSuspiciousUrl(input("Track it at https://www.nzpost.co.nz")),
    ).toBeUndefined();
  });

  it("returns no signal when there is no URL", () => {
    expect(
      detectSuspiciousUrl(input("Your parcel is ready for collection.")),
    ).toBeUndefined();
  });

  it("includes a duplicate suspicious URL only once", () => {
    expect(
      detectSuspiciousUrl(
        input("Use https://bit.ly/check or https://bit.ly/check."),
      )?.evidence,
    ).toEqual(["https://bit.ly/check"]);
  });

  it("removes trailing sentence punctuation from suspicious URL evidence", () => {
  expect(
    detectSuspiciousUrl(
      input("Open https://bit.ly/account-check."),
    )?.evidence,
  ).toEqual(["https://bit.ly/account-check"]);
});

it("does not flag a deeply nested normal HTTPS hostname by itself", () => {
  expect(
    detectSuspiciousUrl(
      input(
        "Visit https://login.accounts.customer.services.example.co.nz",
      ),
    ),
  ).toBeUndefined();
});

  it("combines urgency, credential, and suspicious URL signals", () => {
    const result = analyseMessage(
      input("Urgent: confirm your password at https://bit.ly/reset"),
    );

    expect(result.signals.map((signal) => signal.code)).toEqual([
      "URGENCY",
      "CREDENTIAL_REQUEST",
      "SUSPICIOUS_URL",
    ]);
    expect(result.riskScore).toBe(70);
    expect(result.riskLevel).toBe("high");
  });

  it("returns no signal for empty input", () => {
    expect(detectSuspiciousUrl(input(""))).toBeUndefined();
  });
});
