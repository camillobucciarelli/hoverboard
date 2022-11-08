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

export const fetchGameHistory = async (dispatch: Dispatch<GameHistoryActions>) => {
  if (subscription instanceof Initialized) {
    subscription = subscribeToCollection(
      'generatedGameHistory',
      () => dispatch({ type: FETCH_GAME_HISTORY, payload: { id } }),
      (payload: GameHistory[]) => dispatch({ type: FETCH_GAME_HISTORY_SUCCESS, payload }),
      (payload: Error) => dispatch({ type: FETCH_GAME_HISTORY_FAILURE, payload })
    );
  }
};
