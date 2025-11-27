export interface User {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatar: string;
  bio: string;
  score: number; // 0-100, based on risk history
  completedRisks: number;
  totalRisks: number;
  memberSince: Date;
  verification: {
    creditCheckScore: number; // 0-100, needs to be >= 70 for verification
    hasFullName: boolean;
    hasVerifiedEmail: boolean;
    hasVerifiedPhone: boolean;
    hasConfirmedAddress: boolean;
    hasBankAccount: boolean;
  };
}

export function getDisplayName(user: User, format: 'full' | 'initial' = 'full'): string {
  if (format === 'initial') {
    return `${user.firstName} ${user.lastName.charAt(0)}.`;
  }
  return `${user.firstName} ${user.lastName}`;
}

export function getUserScore(completedRisks: number, totalRisks: number): number {
  if (totalRisks === 0) return 100;
  const completionRate = completedRisks / totalRisks;
  return Math.round(completionRate * 100);
}

export function isUserVerified(user: User): boolean {
  const { verification } = user;
  const profileComplete = 
    verification.hasFullName &&
    verification.hasVerifiedEmail &&
    verification.hasVerifiedPhone &&
    verification.hasConfirmedAddress &&
    verification.hasBankAccount;
  
  return verification.creditCheckScore >= 70 && profileComplete;
}

export function getProfileCompleteness(user: User): number {
  const { verification } = user;
  const checks = [
    verification.hasFullName,
    verification.hasVerifiedEmail,
    verification.hasVerifiedPhone,
    verification.hasConfirmedAddress,
    verification.hasBankAccount,
  ];
  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}
