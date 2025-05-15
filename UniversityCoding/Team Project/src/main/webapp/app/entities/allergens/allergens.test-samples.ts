import { IAllergens, NewAllergens } from './allergens.model';

export const sampleWithRequiredData: IAllergens = {
  id: 66913,
};

export const sampleWithPartialData: IAllergens = {
  id: 84323,
  celery: false,
  fish: false,
  nuts: false,
  sesame: false,
  sulphur: true,
};

export const sampleWithFullData: IAllergens = {
  id: 46723,
  celery: true,
  gluten: true,
  crustaceans: false,
  egg: false,
  fish: true,
  lupin: false,
  milk: false,
  molluscs: false,
  mustard: false,
  nuts: false,
  peanuts: true,
  sesame: true,
  soya: true,
  sulphur: true,
};

export const sampleWithNewData: NewAllergens = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
