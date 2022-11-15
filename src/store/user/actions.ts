import { ParsedToken } from 'firebase/auth';
import { store } from '..';
import { FirebaseUser, toClaims, toUser } from '../../models/user';
import { REMOVE_USER, SET_USER, UserActions } from './types';

export const setUser = (user: FirebaseUser, claims: ParsedToken) => {
  store.dispatch<UserActions>({ type: SET_USER, payload: toUser(user, toClaims(claims)) });
};

export const removeUser = () => {
  store.dispatch<UserActions>({ type: REMOVE_USER });
};
