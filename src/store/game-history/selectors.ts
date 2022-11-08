import { Initialized, Success } from '@abraham/remotedata';
import { RootState, store } from '..';
import { SpeakerWithTags } from '../../models/speaker';
import { fetchGameHistory } from './actions';

export const selectGameHistory = (state: RootState): SpeakerWithTags[] => {
  const { speakers } = state;
  if (speakers instanceof Success) {
    return speakers.data;
  } else if (speakers instanceof Initialized) {
    store.dispatch(fetchGameHistory);
  }
  return [];
};
