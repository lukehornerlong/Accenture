import { IPost } from 'app/entities/post/post.model';
import { IUser } from 'app/entities/user/user.model';

export interface ILikedBy {
  id: number;
  liked?: boolean | null;
  post?: Pick<IPost, 'id'> | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewLikedBy = Omit<ILikedBy, 'id'> & { id: null };
