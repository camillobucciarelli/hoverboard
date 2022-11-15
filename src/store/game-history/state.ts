import { Initialized, RemoteData } from '@abraham/remotedata';
import { GameHistory } from './types';

export type GameHistoryState = RemoteData<Error, GameHistory[]>;
export const initialGameHistoryState: GameHistoryState = new Initialized();
