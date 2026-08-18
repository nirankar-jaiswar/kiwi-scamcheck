import type {
  RiskSignal,
  ScamAnalysisInput,
} from "@kiwi-scamcheck/contracts";

const HTTP_URL_PATTERN = /https?:\/\/[^\s<>"']+/gi;

const URL_SHORTENERS = new Set([
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "rb.gy",
  "is.gd",
  "tiny.cc",
]);

function isIpAddress(hostname: string): boolean {
  return /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname) ||
    (hostname.startsWith("[") && hostname.endsWith("]"));
}

function isSuspicious(url: URL): boolean {
  const hostname = url.hostname.toLowerCase();
  const shortenerHostname = hostname.replace(/^www\./, "");

  return (
    URL_SHORTENERS.has(shortenerHostname) ||
    isIpAddress(hostname) ||
    url.username.length > 0 ||
    url.password.length > 0
  );
}

export function detectSuspiciousUrl(
  input: ScamAnalysisInput,
): RiskSignal | undefined {
  const evidence = Array.from(input.text.matchAll(HTTP_URL_PATTERN))
    .map(([match]) => match.replace(/[),.!?;:]+$/, ""))
    .filter((candidate) => {
      try {
        return isSuspicious(new URL(candidate));
      } catch {
        return false;
      }
    })
    .filter((candidate, index, candidates) =>
      candidates.indexOf(candidate) === index
    );

  if (evidence.length === 0) {
    return undefined;
  }

  return {
    code: "SUSPICIOUS_URL",
    title: "Suspicious link detected",
    explanation:
      "The message contains a link with characteristics commonly used to disguise its destination.",
    severity: "high",
    evidence,
    scoreContribution: 25,
  };
}
