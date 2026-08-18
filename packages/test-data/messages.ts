export type ExpectedRisk = "low" | "medium" | "high";

export interface EvaluationMessage {
  id: string;
  channel: "sms" | "email" | "marketplace" | "social" | "unknown";
  text: string;
  expectedRisk: ExpectedRisk;
  expectedSignals: string[];
}

export const evaluationMessages: EvaluationMessage[] = [
    // Obvious scam examples
  {
    id: "scam-001",
    channel: "sms",
    text: "Urgent: confirm your password immediately at https://bit.ly/account-reset",
    expectedRisk: "high",
    expectedSignals: [
      "URGENCY",
      "CREDENTIAL_REQUEST",
      "SUSPICIOUS_URL",
    ],
  },

  {
    id: "scam-002",
    channel: "sms",
    text: "Final warning: your parcel is on hold. Act now and open https://tinyurl.com/parcel-check",
    expectedRisk: "medium",
    expectedSignals: [
      "URGENCY",
      "SUSPICIOUS_URL",
    ],
  },

  {
    id: "scam-003",
    channel: "email",
    text: "Please send us your OTP to complete your account verification.",
    expectedRisk: "medium",
    expectedSignals: [
      "CREDENTIAL_REQUEST",
    ],
  },

  {
    id: "scam-004",
    channel: "marketplace",
    text: "Payment is waiting. Open https://192.168.1.20/payment and enter your login credentials.",
    expectedRisk: "medium",
    expectedSignals: [
      "CREDENTIAL_REQUEST",
      "SUSPICIOUS_URL",
    ],
  },

  // Legitimate examples

  {
    id: "legit-001",
    channel: "sms",
    text: "Your NZ Post parcel is ready for collection. Track your parcel at https://www.nzpost.co.nz",
    expectedRisk: "low",
    expectedSignals: [],
  },

  {
    id: "legit-002",
    channel: "sms",
    text: "Reminder: your dental appointment is tomorrow at 10:30 AM.",
    expectedRisk: "low",
    expectedSignals: [],
  },

  {
    id: "legit-003",
    channel: "email",
    text: "Never share your password or OTP with anyone. Our staff will not ask you for these details.",
    expectedRisk: "low",
    expectedSignals: [],
  },

  {
    id: "legit-004",
    channel: "email",
    text: "The project meeting has been moved to Friday at 2 PM. Please update your calendar.",
    expectedRisk: "low",
    expectedSignals: [],
  },

  // Ambiguous / false-positive tests

  {
    id: "ambiguous-001",
    channel: "email",
    text: "Urgent: the office will close early today because of severe weather.",
    expectedRisk: "low",
    expectedSignals: [
      "URGENCY",
    ],
  },

  {
    id: "ambiguous-002",
    channel: "social",
    text: "Here is the shortened link to the event registration page: https://bit.ly/community-event",
    expectedRisk: "medium",
    expectedSignals: [
      "SUSPICIOUS_URL",
    ],
  },

  {
    id: "ambiguous-003",
    channel: "email",
    text: "Your account password was recently changed. If this was not you, visit https://www.example.com/security",
    expectedRisk: "low",
    expectedSignals: [],
  },

  {
    id: "ambiguous-004",
    channel: "email",
    text: "For your security, do not share your password. If you need to reset it, use the official account settings page.",
    expectedRisk: "low",
    expectedSignals: [],
  },
];