import { IPost } from 'app/entities/post/post.model';
import { IUser } from 'app/entities/user/user.model';

export interface IComment {
  id: number;
  comment?: string | null;
  rating?: number | null;
  post?: Pick<IPost, 'id'> | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewComment = Omit<IComment, 'id'> & { id: null };
