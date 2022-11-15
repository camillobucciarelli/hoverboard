import { Failure, Initialized, Pending, RemoteData, Success } from '@abraham/remotedata';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameHistoryState, initialGameHistoryState } from './state';
import {
  FETCH_GAME_HISTORY,
  FETCH_GAME_HISTORY_FAILURE,
  FETCH_GAME_HISTORY_SUCCESS,
  GameHistoryActions,
  Player,
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

const initialState: { isLoading: boolean; data: Player | null; error: Error | null } = {
  isLoading: true,
  data: null,
  error: null,
};

export const playerSlicer = createSlice({
  name: 'PLAYER',
  initialState,
  reducers: {
    setPlayer: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setPlayerSuccess: (state, action: PayloadAction<Player>) => {
      state.data = action.payload;
      state.isLoading = false;
    },
    setPlayerFailure: (state, action: PayloadAction<Error>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const playerReducer = playerSlicer.reducer;
