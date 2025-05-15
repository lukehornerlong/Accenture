import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPost, NewPost } from '../post.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPost for edit and NewPostFormGroupInput for create.
 */
type PostFormGroupInput = IPost | PartialWithRequiredKeyOf<NewPost>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPost | NewPost> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

type PostFormRawValue = FormValueOf<IPost>;

type NewPostFormRawValue = FormValueOf<NewPost>;

type PostFormDefaults = Pick<NewPost, 'id' | 'timestamp' | 'dietaryTags'>;

type PostFormGroupContent = {
  id: FormControl<PostFormRawValue['id'] | NewPost['id']>;
  postTitle: FormControl<PostFormRawValue['postTitle']>;
  postPic: FormControl<PostFormRawValue['postPic']>;
  postPicContentType: FormControl<PostFormRawValue['postPicContentType']>;
  postDesc: FormControl<PostFormRawValue['postDesc']>;
  timestamp: FormControl<PostFormRawValue['timestamp']>;
  likes: FormControl<PostFormRawValue['likes']>;
  affordability: FormControl<PostFormRawValue['affordability']>;
  simplicity: FormControl<PostFormRawValue['simplicity']>;
  shelfLife: FormControl<PostFormRawValue['shelfLife']>;
  user: FormControl<PostFormRawValue['user']>;
  dietaryTags: FormControl<PostFormRawValue['dietaryTags']>;
};

export type PostFormGroup = FormGroup<PostFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PostFormService {
  createPostFormGroup(post: PostFormGroupInput = { id: null }): PostFormGroup {
    const postRawValue = this.convertPostToPostRawValue({
      ...this.getFormDefaults(),
      ...post,
    });
    return new FormGroup<PostFormGroupContent>({
      id: new FormControl(
        { value: postRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      postTitle: new FormControl(postRawValue.postTitle),
      postPic: new FormControl(postRawValue.postPic),
      postPicContentType: new FormControl(postRawValue.postPicContentType),
      postDesc: new FormControl(postRawValue.postDesc),
      timestamp: new FormControl(postRawValue.timestamp),
      likes: new FormControl(postRawValue.likes),
      affordability: new FormControl(postRawValue.affordability),
      simplicity: new FormControl(postRawValue.simplicity),
      shelfLife: new FormControl(postRawValue.shelfLife),
      user: new FormControl(postRawValue.user),
      dietaryTags: new FormControl(postRawValue.dietaryTags ?? []),
    });
  }

  getPost(form: PostFormGroup): IPost | NewPost {
    return this.convertPostRawValueToPost(form.getRawValue() as PostFormRawValue | NewPostFormRawValue);
  }

  resetForm(form: PostFormGroup, post: PostFormGroupInput): void {
    const postRawValue = this.convertPostToPostRawValue({ ...this.getFormDefaults(), ...post });
    form.reset(
      {
        ...postRawValue,
        id: { value: postRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PostFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timestamp: currentTime,
      dietaryTags: [],
    };
  }

  private convertPostRawValueToPost(rawPost: PostFormRawValue | NewPostFormRawValue): IPost | NewPost {
    return {
      ...rawPost,
      timestamp: dayjs(rawPost.timestamp, DATE_TIME_FORMAT),
    };
  }

  private convertPostToPostRawValue(
    post: IPost | (Partial<NewPost> & PostFormDefaults)
  ): PostFormRawValue | PartialWithRequiredKeyOf<NewPostFormRawValue> {
    return {
      ...post,
      timestamp: post.timestamp ? post.timestamp.format(DATE_TIME_FORMAT) : undefined,
      dietaryTags: post.dietaryTags ?? [],
    };
  }
}
