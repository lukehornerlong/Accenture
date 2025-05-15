import dayjs from 'dayjs/esm';

import { IUserPantry, NewUserPantry } from './user-pantry.model';

export const sampleWithRequiredData: IUserPantry = {
  id: 40909,
};

export const sampleWithPartialData: IUserPantry = {
  id: 73005,
};

export const sampleWithFullData: IUserPantry = {
  id: 70812,
  timestamp: dayjs('2023-03-19T19:01'),
};

export const sampleWithNewData: NewUserPantry = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
