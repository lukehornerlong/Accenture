import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IDietaryTags } from 'app/entities/dietary-tags/dietary-tags.model';

export interface IPost {
  id: number;
  postTitle?: string | null;
  postPic?: string | null;
  postPicContentType?: string | null;
  postDesc?: string | null;
  timestamp?: dayjs.Dayjs | null;
  likes?: number | null;
  affordability?: number | null;
  simplicity?: number | null;
  shelfLife?: number | null;
  //postaverage?: number | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  dietaryTags?: Pick<IDietaryTags, 'id' | 'dietary'>[] | null;
}

export type NewPost = Omit<IPost, 'id'> & { id: null };
