import { Initialized, RemoteData } from '@abraham/remotedata';
import { Player } from '../../models/player';

export type PlayersState = RemoteData<Error, Player[]>;
export const initialPlayersState: PlayersState = new Initialized();
