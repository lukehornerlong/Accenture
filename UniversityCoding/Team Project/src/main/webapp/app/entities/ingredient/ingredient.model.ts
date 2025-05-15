import { IPost } from 'app/entities/post/post.model';

export interface IIngredient {
  id: number;
  ingredientName?: string | null;
  price?: number | null;
  shop?: string | null;
  post?: Pick<IPost, 'id'> | null;
}

export type NewIngredient = Omit<IIngredient, 'id'> & { id: null };
