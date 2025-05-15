import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserExtra, NewUserExtra } from '../user-extra.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserExtra for edit and NewUserExtraFormGroupInput for create.
 */
type UserExtraFormGroupInput = IUserExtra | PartialWithRequiredKeyOf<NewUserExtra>;

type UserExtraFormDefaults = Pick<NewUserExtra, 'id'>;

type UserExtraFormGroupContent = {
  id: FormControl<IUserExtra['id'] | NewUserExtra['id']>;
  profilePic: FormControl<IUserExtra['profilePic']>;
  profilePicContentType: FormControl<IUserExtra['profilePicContentType']>;
  biography: FormControl<IUserExtra['biography']>;
  profileBanner: FormControl<IUserExtra['profileBanner']>;
  profileBannerContentType: FormControl<IUserExtra['profileBannerContentType']>;
  age: FormControl<IUserExtra['age']>;
  pronouns: FormControl<IUserExtra['pronouns']>;
  user: FormControl<IUserExtra['user']>;
};

export type UserExtraFormGroup = FormGroup<UserExtraFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserExtraFormService {
  createUserExtraFormGroup(userExtra: UserExtraFormGroupInput = { id: null }): UserExtraFormGroup {
    const userExtraRawValue = {
      ...this.getFormDefaults(),
      ...userExtra,
    };
    return new FormGroup<UserExtraFormGroupContent>({
      id: new FormControl(
        { value: userExtraRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      profilePic: new FormControl(userExtraRawValue.profilePic),
      profilePicContentType: new FormControl(userExtraRawValue.profilePicContentType),
      biography: new FormControl(userExtraRawValue.biography),
      profileBanner: new FormControl(userExtraRawValue.profileBanner),
      profileBannerContentType: new FormControl(userExtraRawValue.profileBannerContentType),
      age: new FormControl(userExtraRawValue.age),
      pronouns: new FormControl(userExtraRawValue.pronouns),
      user: new FormControl(userExtraRawValue.user),
    });
  }

  getUserExtra(form: UserExtraFormGroup): IUserExtra | NewUserExtra {
    return form.getRawValue() as IUserExtra | NewUserExtra;
  }

  resetForm(form: UserExtraFormGroup, userExtra: UserExtraFormGroupInput): void {
    const userExtraRawValue = { ...this.getFormDefaults(), ...userExtra };
    form.reset(
      {
        ...userExtraRawValue,
        id: { value: userExtraRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserExtraFormDefaults {
    return {
      id: null,
    };
  }
}
