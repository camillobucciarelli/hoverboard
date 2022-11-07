import { Initialized, Success } from '@abraham/remotedata';
import { orderBy } from 'firebase/firestore';
import { Dispatch } from 'redux';
import { Player } from '../../models/player';
import { subscribeToCollection, Subscription } from '../../utils/firestore';
import {
  PlayersActions,
  FETCH_PLAYERS_LIST,
  FETCH_PLAYERS_LIST_FAILURE,
  FETCH_PLAYERS_LIST_SUCCESS,
} from './types';

let subscription: Subscription = new Initialized();

export const unsubscribe = () => {
  if (subscription instanceof Success) {
    subscription.data();
  }
};

export const fetchPlayersPosts = async (dispatch: Dispatch<PlayersActions>) => {
  if (subscription instanceof Initialized) {
    subscription = subscribeToCollection(
      'games',
      () => dispatch({ type: FETCH_PLAYERS_LIST }),
      (payload: Player[]) => dispatch({ type: FETCH_PLAYERS_LIST_SUCCESS, payload }),
      (payload: Error) => dispatch({ type: FETCH_PLAYERS_LIST_FAILURE, payload }),
      orderBy('score', 'desc')
    );
  }
};
