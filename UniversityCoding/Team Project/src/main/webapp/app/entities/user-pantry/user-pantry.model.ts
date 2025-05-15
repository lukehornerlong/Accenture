import dayjs from 'dayjs/esm';
import { IPost } from 'app/entities/post/post.model';
import { IUser } from 'app/entities/user/user.model';
import { IDietaryTags } from '../dietary-tags/dietary-tags.model';

export interface IUserPantry {
  id: number;
  dietaryTags?: Pick<IDietaryTags, 'id' | 'dietary'>[] | null;
  timestamp?: dayjs.Dayjs | null;
  post?: Pick<IPost, 'id'> | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewUserPantry = Omit<IUserPantry, 'id'> & { id: null };
