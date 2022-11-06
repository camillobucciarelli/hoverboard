import data from '../../docs/default-firebase-data.json';
import { MemberData } from './member';
import { TeamData } from './team';
import { allKeys } from './utils';

type Team = TeamData & {
  members: MemberData[];
};


