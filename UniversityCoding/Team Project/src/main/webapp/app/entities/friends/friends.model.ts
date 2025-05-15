import { IUser } from 'app/entities/user/user.model';

export interface IFriends {
  id: number;
  user_id1?: Pick<IUser, 'id' | 'login'> | null;
  user_id2?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewFriends = Omit<IFriends, 'id'> & { id: null };
