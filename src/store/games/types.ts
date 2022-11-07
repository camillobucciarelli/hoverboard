import { Player } from '../../models/player';

export const FETCH_PLAYERS_LIST = 'FETCH_PLAYERS_LIST';
export const FETCH_PLAYERS_LIST_FAILURE = 'FETCH_PLAYERS_LIST_FAILURE';
export const FETCH_PLAYERS_LIST_SUCCESS = 'FETCH_PLAYERS_LIST_SUCCESS';
export const FETCH_PLAYER_SETTINGS = 'FETCH_PLAYER_SETTINGS';
export const FETCH_PLAYER_SETTINGS_FAILURE = 'FETCH_PLAYER_SETTINGS_FAILURE';
export const FETCH_PLAYER_SETTINGS_SUCCESS = 'FETCH_PLAYER_SETTINGS_SUCCESS';
export const SET_USER_GAMES_SETTINGS = 'SET_USER_GAMES_SETTINGS';
export const SET_USER_GAMES_SETTINGS_FAILURE = 'SET_USER_GAMES_SETTINGS_FAILURE';
export const SET_USER_GAMES_SETTINGS_SUCCESS = 'SET_USER_GAMES_SETTINGS_SUCCESS';

interface FetchPlayersListAction {
  type: typeof FETCH_PLAYERS_LIST;
}

interface FetchPlayersListFailureAction {
  type: typeof FETCH_PLAYERS_LIST_FAILURE;
  payload: Error;
}

interface FetchPlayersListSuccessAction {
  type: typeof FETCH_PLAYERS_LIST_SUCCESS;
  payload: Player[];
}

interface FetchPlayerSettingsListAction {
  type: typeof FETCH_PLAYER_SETTINGS;
}

interface FetchPlayerSettingsFailureAction {
  type: typeof FETCH_PLAYER_SETTINGS_FAILURE;
  payload: Error;
}

interface FetchPlayerSettingsSuccessAction {
  type: typeof FETCH_PLAYER_SETTINGS_SUCCESS;
  payload: Player;
}

interface SetUserGamesSettingsAction {
  type: typeof SET_USER_GAMES_SETTINGS;
}

interface SetUserGamesSettingsFailureAction {
  type: typeof SET_USER_GAMES_SETTINGS_FAILURE;
  payload: Error;
}

interface SetUserGamesSettingsSuccessAction {
  type: typeof SET_USER_GAMES_SETTINGS_SUCCESS;
  payload: Player;
}

export type PlayersActions =
  | FetchPlayersListAction
  | FetchPlayersListFailureAction
  | FetchPlayersListSuccessAction
  | FetchPlayerSettingsListAction
  | FetchPlayerSettingsFailureAction
  | FetchPlayerSettingsSuccessAction
  | SetUserGamesSettingsAction
  | SetUserGamesSettingsFailureAction
  | SetUserGamesSettingsSuccessAction;
