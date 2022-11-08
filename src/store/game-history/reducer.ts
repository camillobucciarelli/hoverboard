import { Failure, Pending, Success } from '@abraham/remotedata';
import { GameHistoryState, initialGameHistoryState } from './state';
import {
  FETCH_GAME_HISTORY,
  FETCH_GAME_HISTORY_FAILURE,
  FETCH_GAME_HISTORY_SUCCESS,
  GameHistoryActions,
} from './types';

export const gameHistoryReducer = (
  state = initialGameHistoryState,
  action: GameHistoryActions
): GameHistoryState => {
  switch (action.type) {
    case FETCH_GAME_HISTORY:
      return new Pending();

    case FETCH_GAME_HISTORY_FAILURE:
      return new Failure(action.payload);

    case FETCH_GAME_HISTORY_SUCCESS:
      return new Success(action.payload);

    default:
      return state;
  }
};
