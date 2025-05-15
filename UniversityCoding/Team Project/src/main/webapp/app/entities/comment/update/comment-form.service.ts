import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IComment, NewComment } from '../comment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IComment for edit and NewCommentFormGroupInput for create.
 */
type CommentFormGroupInput = IComment | PartialWithRequiredKeyOf<NewComment>;

type CommentFormDefaults = Pick<NewComment, 'id'>;

type CommentFormGroupContent = {
  id: FormControl<IComment['id'] | NewComment['id']>;
  comment: FormControl<IComment['comment']>;
  rating: FormControl<IComment['rating']>;
  post: FormControl<IComment['post']>;
  user: FormControl<IComment['user']>;
};

export type CommentFormGroup = FormGroup<CommentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CommentFormService {
  createCommentFormGroup(comment: CommentFormGroupInput = { id: null }): CommentFormGroup {
    const commentRawValue = {
      ...this.getFormDefaults(),
      ...comment,
    };
    return new FormGroup<CommentFormGroupContent>({
      id: new FormControl(
        { value: commentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      comment: new FormControl(commentRawValue.comment),
      rating: new FormControl(commentRawValue.rating),
      post: new FormControl(commentRawValue.post),
      user: new FormControl(commentRawValue.user),
    });
  }

  getComment(form: CommentFormGroup): IComment | NewComment {
    return form.getRawValue() as IComment | NewComment;
  }

  resetForm(form: CommentFormGroup, comment: CommentFormGroupInput): void {
    const commentRawValue = { ...this.getFormDefaults(), ...comment };
    form.reset(
      {
        ...commentRawValue,
        id: { value: commentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CommentFormDefaults {
    return {
      id: null,
    };
  }
}
