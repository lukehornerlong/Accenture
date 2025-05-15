import { IUser } from 'app/entities/user/user.model';

export interface IUserExtra {
  id: number;
  profilePic?: string | null;
  profilePicContentType?: string | null;
  biography?: string | null;
  profileBanner?: string | null;
  profileBannerContentType?: string | null;
  age?: number | null;
  pronouns?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewUserExtra = Omit<IUserExtra, 'id'> & { id: null };
