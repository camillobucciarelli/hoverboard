import type { ParsedToken, User as FirebaseUser } from 'firebase/auth';
import { UserInfo } from 'firebase/auth';

export type { FirebaseUser };
export type Claims = { role?: 'ORGANIZER' | (string & {}) };
export type User = UserInfo & { claims: Claims };

export const toUser = (user: FirebaseUser, claims?: Claims): User => {
  return { ...user.toJSON(), claims } as User;
};

export const toClaims = (claims: ParsedToken = {}): Claims => {
  const partialClaims: Claims = {};

  partialClaims.role = (claims as any)?.role;

  return partialClaims;
};
