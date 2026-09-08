import type {
  RiskSignal,
  ScamAnalysisInput,
} from "@kiwi-scamcheck/contracts";

import { NZ_BRANDS } from "./nz-brands";
import {
  extractHttpUrls,
  isOfficialDomain,
} from "./url-utils";

export function detectBrandLinkMismatch(
  input: ScamAnalysisInput,
): RiskSignal | undefined {
  const urls = extractHttpUrls(input.text);

  if (urls.length === 0) {
    return undefined;
  }

  for (const brand of NZ_BRANDS) {
    const mentionsBrand = brand.mentionPatterns.some((pattern) =>
      pattern.test(input.text),
    );

    if (!mentionsBrand) {
      continue;
    }

    const mismatchedUrls = urls.filter(
      (url) =>
        !isOfficialDomain(
          url.hostname,
          brand.officialDomains,
        ),
    );

    if (mismatchedUrls.length === 0) {
      continue;
    }

    return {
      code: "BRAND_LINK_MISMATCH",
      title: "Link does not match the claimed organisation",
      explanation:
        `The message appears to mention ${brand.name}, but the included link does not use one of its recognised official domains.`,
      severity: "high",
      evidence: mismatchedUrls.map((url) => url.toString()),
      scoreContribution: 60,
    };
  }

  return undefined;
}