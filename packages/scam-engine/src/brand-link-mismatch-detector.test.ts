import { describe, expect, it } from "vitest";

import { detectBrandLinkMismatch } from "./brand-link-mismatch-detector";

describe("detectBrandLinkMismatch", () => {
  it("detects an IRD message linking to a non-IRD domain", () => {
    const signal = detectBrandLinkMismatch({
      channel: "sms",
      text: "{IRD} You are due an additional refund. Confirm your details at https://myird-tax.line.pm",
    });

    expect(signal?.code).toBe("BRAND_LINK_MISMATCH");
    expect(signal?.severity).toBe("high");
    expect(signal?.scoreContribution).toBe(60);
    expect(signal?.evidence).toEqual([
      "https://myird-tax.line.pm/",
    ]);
  });

  it("detects an NZ Post message linking to an unrelated domain", () => {
    const signal = detectBrandLinkMismatch({
      channel: "sms",
      text: "NZ Post: Update your delivery address at https://nzpost-redelivery.example",
    });

    expect(signal?.code).toBe("BRAND_LINK_MISMATCH");
  });

  it("detects an NZTA message linking to an unrelated domain", () => {
    const signal = detectBrandLinkMismatch({
      channel: "sms",
      text: "NZTA: Your toll payment is overdue. Pay at https://nzta-toll-payment.example",
    });

    expect(signal?.code).toBe("BRAND_LINK_MISMATCH");
  });

  it("does not flag an official IRD domain", () => {
    const signal = detectBrandLinkMismatch({
      channel: "sms",
      text: "Inland Revenue: Visit https://www.ird.govt.nz for more information.",
    });

    expect(signal).toBeUndefined();
  });

  it("does not flag an official NZ Post domain", () => {
    const signal = detectBrandLinkMismatch({
      channel: "sms",
      text: "NZ Post: Track your parcel at https://www.nzpost.co.nz",
    });

    expect(signal).toBeUndefined();
  });

  it("allows subdomains of an official domain", () => {
    const signal = detectBrandLinkMismatch({
      channel: "email",
      text: "Inland Revenue: Visit https://services.ird.govt.nz/account",
    });

    expect(signal).toBeUndefined();
  });

  it("rejects a domain that only contains the official domain name", () => {
    const signal = detectBrandLinkMismatch({
      channel: "email",
      text: "IRD: Visit https://ird.govt.nz.attacker.example/refund",
    });

    expect(signal?.code).toBe("BRAND_LINK_MISMATCH");
  });

  it("does not flag an unrelated message with an unrelated URL", () => {
    const signal = detectBrandLinkMismatch({
      channel: "email",
      text: "Register for our community event at https://example.com/event",
    });

    expect(signal).toBeUndefined();
  });

  it("does not flag a brand mention when there is no URL", () => {
    const signal = detectBrandLinkMismatch({
      channel: "sms",
      text: "I went to the NZ Post shop this morning.",
    });

    expect(signal).toBeUndefined();
  });

  it("detects an NZ Police message linking to an unrelated domain", () => {
    const signal = detectBrandLinkMismatch({
      channel: "sms",
      text: "NZ Police: Pay your infringement at https://govt-police.club/nz",
    });

    expect(signal?.code).toBe("BRAND_LINK_MISMATCH");
  });

  it("does not flag the official NZ Police domain", () => {
    const signal = detectBrandLinkMismatch({
      channel: "sms",
      text: "New Zealand Police: Visit https://www.police.govt.nz/pay for infringement information.",
    });

    expect(signal).toBeUndefined();
  });

  it("detects an NZ Customs message linking to an unrelated domain", () => {
    const signal = detectBrandLinkMismatch({
      channel: "sms",
      text: "New Zealand Customs: Pay your clearance fee at https://customs-fee.example",
    });

    expect(signal?.code).toBe("BRAND_LINK_MISMATCH");
  });

  it("does not flag the official NZ Customs domain", () => {
    const signal = detectBrandLinkMismatch({
      channel: "sms",
      text: "New Zealand Customs: Visit https://www.customs.govt.nz for information.",
    });

    expect(signal).toBeUndefined();
  });

  it("detects a Work and Income message linking to an unrelated domain", () => {
    const signal = detectBrandLinkMismatch({
      channel: "sms",
      text: "Work and Income: Review your payment at https://winz-payment.example",
    });

    expect(signal?.code).toBe("BRAND_LINK_MISMATCH");
  });

  it("does not flag the official MyMSD domain", () => {
    const signal = detectBrandLinkMismatch({
      channel: "sms",
      text: "MyMSD: Sign in at https://my.msd.govt.nz",
    });

    expect(signal).toBeUndefined();
  });

  it("detects a Department of Internal Affairs message linking to an unrelated domain", () => {
    const signal = detectBrandLinkMismatch({
      channel: "email",
      text: "Department of Internal Affairs: Review your account at https://dia-review.example",
    });

    expect(signal?.code).toBe("BRAND_LINK_MISMATCH");
  });

  it("does not flag the official DIA domain", () => {
    const signal = detectBrandLinkMismatch({
      channel: "email",
      text: "Department of Internal Affairs: Visit https://www.dia.govt.nz for information.",
    });

    expect(signal).toBeUndefined();
  });
});