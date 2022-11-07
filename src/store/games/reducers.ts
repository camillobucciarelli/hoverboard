import { Failure, Pending, Success } from '@abraham/remotedata';
import { PlayersState, initialPlayersState, PlayerSettingsState, initialPlayerSettingsState } from './state';
import {
  PlayersActions,
  FETCH_PLAYERS_LIST,
  FETCH_PLAYERS_LIST_FAILURE,
  FETCH_PLAYERS_LIST_SUCCESS,
  SET_USER_GAMES_SETTINGS,
  SET_USER_GAMES_SETTINGS_FAILURE,
  SET_USER_GAMES_SETTINGS_SUCCESS,
  FETCH_PLAYER_SETTINGS,
  FETCH_PLAYER_SETTINGS_FAILURE,
  FETCH_PLAYER_SETTINGS_SUCCESS,
} from './types';

export const playersReducer = (
  state = initialPlayersState, 
  action: PlayersActions
): PlayersState => {
  switch (action.type) {
    case FETCH_PLAYERS_LIST:
      return new Pending();

    case FETCH_PLAYERS_LIST_FAILURE:
      return new Failure(action.payload);

    case FETCH_PLAYERS_LIST_SUCCESS:
      return new Success(action.payload);

    default:
      return state;
  }
};

export const playerSettingsReducer = (
  state = initialPlayerSettingsState, 
  action: PlayersActions
): PlayerSettingsState => {
  switch (action.type) {
    case FETCH_PLAYER_SETTINGS:
    case SET_USER_GAMES_SETTINGS:
      return new Pending();

    case FETCH_PLAYER_SETTINGS_FAILURE:
    case SET_USER_GAMES_SETTINGS_FAILURE:
      return new Failure(action.payload);

    case FETCH_PLAYER_SETTINGS_SUCCESS:
    case SET_USER_GAMES_SETTINGS_SUCCESS:
      return new Success(action.payload);

    default:
      return state;
  }
};
