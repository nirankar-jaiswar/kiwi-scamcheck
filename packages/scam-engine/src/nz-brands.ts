export interface NzBrand {
  id: string;
  name: string;
  mentionPatterns: readonly RegExp[];
  officialDomains: readonly string[];
}

export const NZ_BRANDS: readonly NzBrand[] = [
  {
    id: "ird",
    name: "Inland Revenue",
    mentionPatterns: [
      /\bird\b/i,
      /\binland\s+revenue\b/i,
      /\bmyir\b/i,
    ],
    officialDomains: [
      "ird.govt.nz",
    ],
  },
  {
    id: "nz-post",
    name: "NZ Post",
    mentionPatterns: [
      /\bnz\s*post\b/i,
      /\bnew\s+zealand\s+post\b/i,
    ],
    officialDomains: [
      "nzpost.co.nz",
      "nzp.st",
    ],
  },
  {
    id: "nzta",
    name: "NZ Transport Agency",
    mentionPatterns: [
      /\bnzta\b/i,
      /\bwaka\s+kotahi\b/i,
    ],
    officialDomains: [
      "nzta.govt.nz",
    ],
  },
];