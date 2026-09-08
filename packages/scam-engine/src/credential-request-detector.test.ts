import { describe, expect, it } from "vitest";

import type { ScamAnalysisInput } from "@kiwi-scamcheck/contracts";

import { detectCredentialRequest } from "./credential-request-detector";
import { analyseMessage } from "./index";

function input(text: string): ScamAnalysisInput {
  return { text, channel: "unknown" };
}

describe("detectCredentialRequest", () => {
  it("detects a password request", () => {
    expect(
      detectCredentialRequest(
        input("Please provide your password."),
      ),
    ).toEqual({
      code: "CREDENTIAL_REQUEST",
      title: "Sensitive information requested",
      explanation:
        "The message asks for authentication, personal, account, or payment information that may be sensitive.",
      severity: "high",
      evidence: ["provide your password"],
      scoreContribution: 30,
    });
  });

  it("detects an OTP request", () => {
    expect(
      detectCredentialRequest(
        input("Send us your OTP to continue."),
      )?.evidence,
    ).toEqual(["Send us your OTP"]);
  });

  it("detects a verification-code request", () => {
    expect(
      detectCredentialRequest(
        input("Enter the verification code from the message."),
      )?.evidence,
    ).toEqual(["Enter the verification code"]);
  });

  it("matches mixed-case input", () => {
    expect(
      detectCredentialRequest(
        input("SUBMIT Your Login Credentials"),
      )?.evidence,
    ).toEqual(["SUBMIT Your Login Credentials"]);
  });

  it("detects a request to confirm personal details", () => {
    expect(
      detectCredentialRequest(
        input("Please confirm your details now."),
      )?.evidence,
    ).toEqual(["confirm your details"]);
  });

  it("detects a request to update bank details", () => {
    expect(
      detectCredentialRequest(
        input("Update your bank details to receive the refund."),
      )?.evidence,
    ).toEqual(["Update your bank details"]);
  });

  it("detects a request to verify card details", () => {
    expect(
      detectCredentialRequest(
        input("Verify your card details to continue."),
      )?.evidence,
    ).toEqual(["Verify your card details"]);
  });

  it("combines credential and urgency signals in message analysis", () => {
    const result = analyseMessage(
      input("Act now and confirm your security code."),
    );

    expect(
      result.signals.map((signal) => signal.code),
    ).toEqual([
      "URGENCY",
      "CREDENTIAL_REQUEST",
    ]);

    expect(result.riskScore).toBe(45);
    expect(result.riskLevel).toBe("medium");
  });

  it("does not flag advice never to share a password", () => {
    expect(
      detectCredentialRequest(
        input("Never share your password with anyone."),
      ),
    ).toBeUndefined();
  });

  it("does not flag advice not to share an OTP", () => {
    expect(
      detectCredentialRequest(
        input("Do not share your OTP with anyone."),
      ),
    ).toBeUndefined();
  });

  it("does not flag legitimate security advice", () => {
    expect(
      detectCredentialRequest(
        input(
          "Use a unique password and enable two-factor authentication.",
        ),
      ),
    ).toBeUndefined();
  });

  it("does not treat ordinary appointment details as sensitive information", () => {
    expect(
      detectCredentialRequest(
        input(
          "Please confirm your appointment details with reception.",
        ),
      ),
    ).toBeUndefined();
  });

  it("returns no signal for empty input", () => {
    expect(
      detectCredentialRequest(input("")),
    ).toBeUndefined();
  });
});