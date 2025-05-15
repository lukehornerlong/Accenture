import { IUser } from 'app/entities/user/user.model';
import { IPost } from 'app/entities/post/post.model';

export interface IAllergens {
  id: number;
  celery?: boolean | null;
  gluten?: boolean | null;
  crustaceans?: boolean | null;
  egg?: boolean | null;
  fish?: boolean | null;
  lupin?: boolean | null;
  milk?: boolean | null;
  molluscs?: boolean | null;
  mustard?: boolean | null;
  nuts?: boolean | null;
  peanuts?: boolean | null;
  sesame?: boolean | null;
  soya?: boolean | null;
  sulphur?: boolean | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  post?: Pick<IPost, 'id'> | null;
}

export type NewAllergens = Omit<IAllergens, 'id'> & { id: null };
