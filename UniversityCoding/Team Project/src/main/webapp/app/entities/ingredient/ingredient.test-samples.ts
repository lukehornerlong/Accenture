import { IIngredient, NewIngredient } from './ingredient.model';

export const sampleWithRequiredData: IIngredient = {
  id: 37469,
};

export const sampleWithPartialData: IIngredient = {
  id: 48440,
  shop: 'intermediate Directives',
};

export const sampleWithFullData: IIngredient = {
  id: 6937,
  ingredientName: 'Savings Representative back',
  price: 50595,
  shop: 'Lithuania Buckinghamshire Fresh',
};

export const sampleWithNewData: NewIngredient = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
