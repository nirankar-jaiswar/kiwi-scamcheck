import type {
  RiskSignal,
  ScamAnalysisInput,
} from "@kiwi-scamcheck/contracts";

const FAMILY_GREETING_PATTERN =
  /\b(?:hi|hey|hello)\s+(?:mum|mom|dad|mummy|daddy)\b/i;

const NUMBER_CHANGE_PATTERN =
  /\b(?:this\s+is\s+my\s+new\s+number|my\s+new\s+number|new\s+phone\s+number|changed\s+my\s+number)\b/i;

const PHONE_PROBLEM_PATTERN =
  /\b(?:(?:my\s+)?(?:old\s+)?phone\s+(?:broke|is\s+broken|was\s+broken|died|was\s+lost|is\s+lost|was\s+stolen|got\s+stolen|fell\s+in(?:to)?\s+the\s+toilet)|lost\s+my\s+phone)\b/i;

const CONTACT_MOVE_PATTERN =
  /\b(?:whatsapp|message\s+me|text\s+me|save\s+(?:this|my)\s+(?:new\s+)?number)\b/i;

export function detectFamilyImpersonation(
  input: ScamAnalysisInput,
): RiskSignal | undefined {
  const hasFamilyGreeting =
    FAMILY_GREETING_PATTERN.test(input.text);

  if (!hasFamilyGreeting) {
    return undefined;
  }

  const contextMatches = [
    NUMBER_CHANGE_PATTERN.test(input.text),
    PHONE_PROBLEM_PATTERN.test(input.text),
    CONTACT_MOVE_PATTERN.test(input.text),
  ].filter(Boolean).length;

  if (contextMatches < 2) {
    return undefined;
  }

  const evidence = [
    input.text.match(FAMILY_GREETING_PATTERN)?.[0],
    input.text.match(NUMBER_CHANGE_PATTERN)?.[0],
    input.text.match(PHONE_PROBLEM_PATTERN)?.[0],
    input.text.match(CONTACT_MOVE_PATTERN)?.[0],
  ].filter((match): match is string => match !== undefined);

  return {
    code: "FAMILY_IMPERSONATION",
    title: "Possible family impersonation",
    explanation:
      "The message uses a family greeting together with a changed-number or phone-problem story and asks to move contact to another number or messaging service.",
    severity: "medium",
    evidence,
    scoreContribution: 25,
  };
}