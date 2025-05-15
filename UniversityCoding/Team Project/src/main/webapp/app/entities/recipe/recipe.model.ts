export interface IRecipe {
  id: number;
  recipeTitle?: string | null;
}

export type NewRecipe = Omit<IRecipe, 'id'> & { id: null };
