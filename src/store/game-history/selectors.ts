import { Initialized, Success } from '@abraham/remotedata';
import { RootState, store } from '..';
import { fetchGameHistory } from './actions';
import { GameHistory } from './types';

export const selectGameHistoryByUserId = (state: RootState, userId: string): GameHistory[] => {
  const { gamesHistory } = state;
  if (gamesHistory instanceof Success) {
    return gamesHistory.data;
  } else if (gamesHistory instanceof Initialized) {
    store.dispatch(fetchGameHistory(userId));
  }
  return [];
};
