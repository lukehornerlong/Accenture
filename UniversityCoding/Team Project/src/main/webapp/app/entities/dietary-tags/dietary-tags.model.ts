import { IPost } from 'app/entities/post/post.model';

export interface IDietaryTags {
  id: number;
  dietary?: string | null;
  posts?: Pick<IPost, 'id'>[] | null;
}

export type NewDietaryTags = Omit<IDietaryTags, 'id'> & { id: null };
