import { ILikedBy, NewLikedBy } from './liked-by.model';

export const sampleWithRequiredData: ILikedBy = {
  id: 63274,
};

export const sampleWithPartialData: ILikedBy = {
  id: 89885,
};

export const sampleWithFullData: ILikedBy = {
  id: 98144,
  liked: false,
};

export const sampleWithNewData: NewLikedBy = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
