import { Initialized, Success } from '@abraham/remotedata';
import { Dispatch } from 'redux';
import { subscribeToCollection, Subscription } from '../../utils/firestore';
import {
  FETCH_GAME_HISTORY,
  FETCH_GAME_HISTORY_FAILURE,
  FETCH_GAME_HISTORY_SUCCESS,
  GameHistory,
  GameHistoryActions,
} from './types';

let subscription: Subscription = new Initialized();

export const unsubscribe = () => {
  if (subscription instanceof Success) {
    subscription.data();
  }
};

export const fetchGameHistory =
  (userId: string) => async (dispatch: Dispatch<GameHistoryActions>) => {
    subscription = subscribeToCollection(
      `games/${userId}/history`,
      () => dispatch({ type: FETCH_GAME_HISTORY }),
      (payload: GameHistory[]) => {
        return dispatch({ type: FETCH_GAME_HISTORY_SUCCESS, payload });
      },
      (payload: Error) => dispatch({ type: FETCH_GAME_HISTORY_FAILURE, payload })
    );
  };
