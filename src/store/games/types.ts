import { Player } from '../../models/player';

export const FETCH_PLAYERS_LIST = 'FETCH_PLAYERS_LIST';
export const FETCH_PLAYERS_LIST_FAILURE = 'FETCH_PLAYERS_LIST_FAILURE';
export const FETCH_PLAYERS_LIST_SUCCESS = 'FETCH_PLAYERS_LIST_SUCCESS';

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

export type PlayersActions =
  | FetchPlayersListAction
  | FetchPlayersListFailureAction
  | FetchPlayersListSuccessAction;
