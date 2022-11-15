import { Initialized, Success } from '@abraham/remotedata';
import { doc, getDoc, orderBy, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Dispatch } from 'redux';
import { RootState, store } from '..';
import { Player } from '../../models/player';
import { selectUserId } from '../user/selectors';
import { subscribeToCollection, Subscription } from '../../utils/firestore';
import {
  PlayersActions,
  FETCH_PLAYERS_LIST,
  FETCH_PLAYERS_LIST_FAILURE,
  FETCH_PLAYERS_LIST_SUCCESS,
  SET_USER_GAMES_SETTINGS,
  SET_USER_GAMES_SETTINGS_SUCCESS,
  SET_USER_GAMES_SETTINGS_FAILURE,
  FETCH_PLAYER_SETTINGS,
  FETCH_PLAYER_SETTINGS_FAILURE,
  FETCH_PLAYER_SETTINGS_SUCCESS,
} from './types';
import { queueSnackbar } from '../snackbars';
import { games } from '../../utils/data';

let subscription: Subscription = new Initialized();

export const unsubscribe = () => {
  if (subscription instanceof Success) {
    subscription.data();
  }
};

export const fetchPlayers = async (dispatch: Dispatch<PlayersActions>) => {
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

const getPlayerSettings = async (userId: string, state: RootState): Promise<Player> => {
  const snapshot = await getDoc(doc(db, 'games', userId));
  
  return snapshot.exists() ? snapshot.data() 
    :
    {
      'name': state.user instanceof Success ? state.user.data.displayName : '',
      'score': 0,
      'plays': false,
      'email': state.user instanceof Success ? state.user.data.email : '',
    };
};

export const fetchPlayerSettings = async (dispatch: Dispatch<PlayersActions>) => {
  const userId = selectUserId(store.getState()) as string;

  if (!userId) return;

  dispatch({
    type: FETCH_PLAYER_SETTINGS,
  });

  try {
    dispatch({
      type: FETCH_PLAYER_SETTINGS_SUCCESS,
      payload: await getPlayerSettings(userId, store.getState()),
    });
  } catch (error) {
    dispatch({
      type: FETCH_PLAYER_SETTINGS_FAILURE,
      payload: error as Error,
    });
  }
};

const setPlayer = async (
  userId: string,
  player: Player
): Promise<void> => {
  await setDoc(doc(db, 'games', userId), player);
};

export const setUserGamesSettings =
  (userId: string, player: Player) =>
  async (dispatch: Dispatch<PlayersActions>) => {
    dispatch({
      type: SET_USER_GAMES_SETTINGS,
    });

    try {
      await setPlayer(userId, player);
      dispatch({
        type: SET_USER_GAMES_SETTINGS_SUCCESS,
        payload: player,
      });
      store.dispatch(queueSnackbar(player.plays ? games.activatedToast : games.deactivatedToast));
    } catch (error) {
      dispatch({
        type: SET_USER_GAMES_SETTINGS_FAILURE,
        payload: error as Error,
      });
    }
  };
