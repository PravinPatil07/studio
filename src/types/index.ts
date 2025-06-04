
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
  donationHistory?: Donation[];
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

export type Donation = {
  id: string;
  donorId: string;
  recipientRequestId?: string; // Optional, if donation fulfills a specific request
  dateOfDonation: string; // ISO string format
  quantity?: string; // e.g., "1 unit", "450ml"
  certificateId?: string;
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

