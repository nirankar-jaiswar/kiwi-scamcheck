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
  {
    id: "nz-police",
    name: "New Zealand Police",
    mentionPatterns: [
      /\bnz\s+police\b/i,
      /\bnew\s+zealand\s+police\b/i,
    ],
    officialDomains: [
      "police.govt.nz",
    ],
  },
  {
    id: "nz-customs",
    name: "New Zealand Customs Service",
    mentionPatterns: [
      /\bnz\s+customs\b/i,
      /\bnew\s+zealand\s+customs\b/i,
      /\bnew\s+zealand\s+customs\s+service\b/i,
    ],
    officialDomains: [
      "customs.govt.nz",
    ],
  },
  {
    id: "work-and-income",
    name: "Work and Income",
    mentionPatterns: [
      /\bwork\s+and\s+income\b/i,
      /\bwinz\b/i,
      /\bmymsd\b/i,
    ],
    officialDomains: [
      "workandincome.govt.nz",
      "msd.govt.nz",
    ],
  },
  {
    id: "dia",
    name: "Department of Internal Affairs",
    mentionPatterns: [
      /\bdepartment\s+of\s+internal\s+affairs\b/i,
      /\bte\s+tari\s+taiwhenua\b/i,
    ],
    officialDomains: [
      "dia.govt.nz",
    ],
  },
];