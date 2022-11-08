import { auth } from '../firebase-config';

export enum Claim {
  ORGANIZER = 'ORGANIZER',
}

export const setCustomClaim = (role: Claim, uid: string): Promise<void> =>
  auth.setCustomUserClaims(uid, { role: role });

export const logUser = async (uid: string): Promise<void> => {
  const user = await auth.getUser(uid);
  console.log(`User ${uid} has been assigned the following roles: ${JSON.stringify(user.customClaims)}`);
}
