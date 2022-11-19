import { Initialized, Success } from '@abraham/remotedata';
import { addDoc, collection, doc, getDoc, orderBy } from 'firebase/firestore';
import { Dispatch } from 'redux';
import { db } from '../../firebase';
import { subscribeToCollection, Subscription } from '../../utils/firestore';
import { playerSlicer } from './reducer';
import {
  FETCH_GAME_HISTORY,
  FETCH_GAME_HISTORY_FAILURE,
  FETCH_GAME_HISTORY_SUCCESS,
  GameHistory,
  GameHistoryActions,
  Player,
} from './types';

export const { setPlayer, setPlayerFailure, setPlayerSuccess } = playerSlicer.actions;

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
        console.log({ payload });
        return dispatch({ type: FETCH_GAME_HISTORY_SUCCESS, payload });
      },
      (payload: Error) => dispatch({ type: FETCH_GAME_HISTORY_FAILURE, payload }),
      orderBy('insert_on', 'desc')
    );
  };

export const changeManually = (userId: string, history: Partial<GameHistory>) => {
  const ref = addDoc(collection(db, `games/${userId}/history`), history);

  console.log(ref);
};

export const fetchPlayer = (userId: string) => async (dispatch: Dispatch) => {
  dispatch(setPlayer());
  const player = await getDoc(doc(db, 'games', userId));
  if (player.exists()) {
    dispatch(setPlayerSuccess(player.data() as Player));
  } else {
    dispatch(setPlayerFailure(new Error('Player not found')));
  }
};
