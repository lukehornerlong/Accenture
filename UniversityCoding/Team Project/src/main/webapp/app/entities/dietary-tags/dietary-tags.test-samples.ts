import { IDietaryTags, NewDietaryTags } from './dietary-tags.model';

export const sampleWithRequiredData: IDietaryTags = {
  id: 19379,
};

export const sampleWithPartialData: IDietaryTags = {
  id: 67690,
};

export const sampleWithFullData: IDietaryTags = {
  id: 13508,
  dietary: 'definition',
};

export const sampleWithNewData: NewDietaryTags = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
