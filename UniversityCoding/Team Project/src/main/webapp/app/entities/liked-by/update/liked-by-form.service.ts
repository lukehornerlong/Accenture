import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILikedBy, NewLikedBy } from '../liked-by.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILikedBy for edit and NewLikedByFormGroupInput for create.
 */
type LikedByFormGroupInput = ILikedBy | PartialWithRequiredKeyOf<NewLikedBy>;

type LikedByFormDefaults = Pick<NewLikedBy, 'id' | 'liked'>;

type LikedByFormGroupContent = {
  id: FormControl<ILikedBy['id'] | NewLikedBy['id']>;
  liked: FormControl<ILikedBy['liked']>;
  post: FormControl<ILikedBy['post']>;
  user: FormControl<ILikedBy['user']>;
};

export type LikedByFormGroup = FormGroup<LikedByFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LikedByFormService {
  createLikedByFormGroup(likedBy: LikedByFormGroupInput = { id: null }): LikedByFormGroup {
    const likedByRawValue = {
      ...this.getFormDefaults(),
      ...likedBy,
    };
    return new FormGroup<LikedByFormGroupContent>({
      id: new FormControl(
        { value: likedByRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      liked: new FormControl(likedByRawValue.liked),
      post: new FormControl(likedByRawValue.post),
      user: new FormControl(likedByRawValue.user),
    });
  }

  getLikedBy(form: LikedByFormGroup): ILikedBy | NewLikedBy {
    return form.getRawValue() as ILikedBy | NewLikedBy;
  }

  resetForm(form: LikedByFormGroup, likedBy: LikedByFormGroupInput): void {
    const likedByRawValue = { ...this.getFormDefaults(), ...likedBy };
    form.reset(
      {
        ...likedByRawValue,
        id: { value: likedByRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LikedByFormDefaults {
    return {
      id: null,
      liked: false,
    };
  }
}
