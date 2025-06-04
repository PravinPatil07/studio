
// src/types/index.ts

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bloodGroup: string;
  age: number;
  dateOfBirth: string; // ISO string format
  address: string;
  contactNumber: string;
  donationHistory: ProfileDonationEntry[];
  donationCount: number;
  badges: BadgeName[]; // Changed from string[] to BadgeName[]
  healthConsiderations?: string; // Added for AI guidance
};

export const urgencyLevels = ["Urgent", "Moderate", "Low"] as const;
export type UrgencyLevel = typeof urgencyLevels[number];

export type BloodRequest = {
  id: string;
  requesterName: string;
  bloodGroup: string;
  location: string; // Could be more structured, e.g., { city: string, state: string }
  dateNeeded: string; // ISO string format
  contactNumber: string;
  urgency: UrgencyLevel;
  isFulfilled: boolean;
  createdAt: string; // ISO string format
  requestedByUserId?: string;
};

// Full donation record (could be stored in a separate "donations" collection if more detail is needed)
export type Donation = {
  id: string;
  userId: string; // The user who donated
  donationDate: string; // ISO string format
  quantity?: string; // e.g., "1 unit", "450ml"
  fulfilledRequestId?: string; // Optional, if donation fulfills a specific request
  certificateId?: string;
  notes?: string;
};

// Simplified entry for user's profile donation history
export type ProfileDonationEntry = {
  date: string; // ISO string format
  fulfilledRequestId?: string; // Optional
  notes?: string; // e.g., "Donated at City Hospital Blood Drive"
};


export type Certificate = {
  id: string;
  userId: string;
  donationId: string;
  issueDate: string; // ISO string format
  certificateUrl: string; // URL to PDF or image
};

export type DonorSearchResult = {
  id: string;
  name: string;
  bloodGroup: string;
  city: string;
  contactInfo: string; // Masked or partial for privacy until direct contact
  lastDonationDate?: string; // ISO string format
};

export const bloodGroupsList = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export type BloodGroup = typeof bloodGroupsList[number];

export const bloodCompatibilityInfo: Record<BloodGroup, { canDonateTo: BloodGroup[], canReceiveFrom: BloodGroup[] }> = {
  "A+": { canDonateTo: ["A+", "AB+"], canReceiveFrom: ["A+", "A-", "O+", "O-"] },
  "A-": { canDonateTo: ["A+", "A-", "AB+", "AB-"], canReceiveFrom: ["A-", "O-"] },
  "B+": { canDonateTo: ["B+", "AB+"], canReceiveFrom: ["B+", "B-", "O+", "O-"] },
  "B-": { canDonateTo: ["B+", "B-", "AB+", "AB-"], canReceiveFrom: ["B-", "O-"] },
  "AB+": { canDonateTo: ["AB+"], canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] }, // Universal recipient
  "AB-": { canDonateTo: ["AB+", "AB-"], canReceiveFrom: ["A-", "B-", "AB-", "O-"] },
  "O+": { canDonateTo: ["A+", "B+", "AB+", "O+"], canReceiveFrom: ["O+", "O-"] },
  "O-": { canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], canReceiveFrom: ["O-"] }, // Universal donor
};

// Badge definitions
export const DONATION_BADGES = {
  FIRST_BLOOD_DROP: "First Blood Drop", // 1 donation
  HELPING_HAND: "Helping Hand",       // 3 donations
  LIFE_GUARDIAN: "Life Guardian",       // 5 donations
  COMMUNITY_HERO: "Community Hero",     // 10 donations
} as const;

export type BadgeName = typeof DONATION_BADGES[keyof typeof DONATION_BADGES];

export const BADGE_THRESHOLDS: Record<BadgeName, number> = {
  [DONATION_BADGES.FIRST_BLOOD_DROP]: 1,
  [DONATION_BADGES.HELPING_HAND]: 3,
  [DONATION_BADGES.LIFE_GUARDIAN]: 5,
  [DONATION_BADGES.COMMUNITY_HERO]: 10,
};

