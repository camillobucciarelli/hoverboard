import { Timestamp } from 'firebase/firestore';

export const FETCH_GAME_HISTORY = 'FETCH_GAME_HISTORY';
export const FETCH_GAME_HISTORY_FAILURE = 'FETCH_GAME_HISTORY_FAILURE';
export const FETCH_GAME_HISTORY_SUCCESS = 'FETCH_GAME_HISTORY_SUCCESS';

export type GameHistory = {
  points: number;
  ref: string;
  timestamp: Timestamp;
  type: 'BY_HAND' | 'TWITTER' | 'INSTAGRAM';
};

interface FetchGameHistoryAction {
  type: typeof FETCH_GAME_HISTORY;
  payload: {
    id: string;
  };
}

interface FetchGameHistoryFailureAction {
  type: typeof FETCH_GAME_HISTORY_FAILURE;
  payload: Error;
}

interface FetchGameHistorySuccessAction {
  type: typeof FETCH_GAME_HISTORY_SUCCESS;
  payload: GameHistory[];
}

export type GameHistoryActions =
  | FetchGameHistoryAction
  | FetchGameHistoryFailureAction
  | FetchGameHistorySuccessAction;
