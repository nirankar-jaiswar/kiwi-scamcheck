const HTTP_URL_PATTERN = /https?:\/\/[^\s<>"']+/gi;

export function extractHttpUrls(text: string): URL[] {
  return Array.from(text.matchAll(HTTP_URL_PATTERN))
    .map(([match]) => match.replace(/[),.!?;:]+$/, ""))
    .map((candidate) => {
      try {
        return new URL(candidate);
      } catch {
        return undefined;
      }
    })
    .filter((url): url is URL => url !== undefined);
}

export function isOfficialDomain(
  hostname: string,
  officialDomains: readonly string[],
): boolean {
  const normalisedHostname = hostname.toLowerCase().replace(/\.$/, "");

  return officialDomains.some((officialDomain) => {
    const normalisedOfficialDomain = officialDomain.toLowerCase();

    return (
      normalisedHostname === normalisedOfficialDomain ||
      normalisedHostname.endsWith(`.${normalisedOfficialDomain}`)
    );
  });
}