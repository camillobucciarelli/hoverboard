import { Failure, Pending, Success } from '@abraham/remotedata';
import { PlayersState, initialPlayersState } from './state';
import {
  PlayersActions,
  FETCH_PLAYERS_LIST,
  FETCH_PLAYERS_LIST_FAILURE,
  FETCH_PLAYERS_LIST_SUCCESS,
} from './types';

export const playersReducer = (state = initialPlayersState, action: PlayersActions): PlayersState => {
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
