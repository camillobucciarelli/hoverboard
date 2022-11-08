import { Initialized, Pending, Success } from '@abraham/remotedata';
import { createSelector } from '@reduxjs/toolkit';
import { RootState, store } from '..';
import { Player } from '../../models/player';
import { fetchPlayers, fetchPlayerSettings } from './actions';

const selectPlayerName = (_state: RootState, playerName: string) => playerName;


export const selectLeaderboard = (state: RootState): Player[] => {
  if (state.players instanceof Success) {
    return state.players.data.filter(player => player.plays);
  } else if (state.schedule instanceof Initialized) {
    store.dispatch(fetchPlayers);
  }
  return [];
};

export const selectFilteredPlayers = createSelector(
  selectLeaderboard,
  selectPlayerName,
  (players: Player[], playerName: string): Player | undefined => {
    return players.find((player) => player.name === playerName);
  }
);

export const selectPlayerSettings = (state: RootState): Player | undefined => {
  const { playerSettings } = state;
  
  if (playerSettings instanceof Success) {
    return playerSettings.data;
  } else if (playerSettings instanceof Initialized) {
    store.dispatch(fetchPlayerSettings);
  }

  return undefined;
};
