import { IFriends, NewFriends } from './friends.model';

export const sampleWithRequiredData: IFriends = {
  id: 38346,
};

export const sampleWithPartialData: IFriends = {
  id: 92912,
};

export const sampleWithFullData: IFriends = {
  id: 26132,
};

export const sampleWithNewData: NewFriends = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
