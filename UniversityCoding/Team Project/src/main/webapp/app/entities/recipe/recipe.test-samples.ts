import { IRecipe, NewRecipe } from './recipe.model';

export const sampleWithRequiredData: IRecipe = {
  id: 37149,
};

export const sampleWithPartialData: IRecipe = {
  id: 51009,
  recipeTitle: 'Real SCSI Unbranded',
};

export const sampleWithFullData: IRecipe = {
  id: 80379,
  recipeTitle: 'Streets Stravenue',
};

export const sampleWithNewData: NewRecipe = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
