import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IUserPantry, NewUserPantry } from '../user-pantry.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserPantry for edit and NewUserPantryFormGroupInput for create.
 */
type UserPantryFormGroupInput = IUserPantry | PartialWithRequiredKeyOf<NewUserPantry>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IUserPantry | NewUserPantry> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

type UserPantryFormRawValue = FormValueOf<IUserPantry>;

type NewUserPantryFormRawValue = FormValueOf<NewUserPantry>;

type UserPantryFormDefaults = Pick<NewUserPantry, 'id' | 'timestamp'>;

type UserPantryFormGroupContent = {
  id: FormControl<UserPantryFormRawValue['id'] | NewUserPantry['id']>;
  timestamp: FormControl<UserPantryFormRawValue['timestamp']>;
  post: FormControl<UserPantryFormRawValue['post']>;
  user: FormControl<UserPantryFormRawValue['user']>;
};

export type UserPantryFormGroup = FormGroup<UserPantryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserPantryFormService {
  createUserPantryFormGroup(userPantry: UserPantryFormGroupInput = { id: null }): UserPantryFormGroup {
    const userPantryRawValue = this.convertUserPantryToUserPantryRawValue({
      ...this.getFormDefaults(),
      ...userPantry,
    });
    return new FormGroup<UserPantryFormGroupContent>({
      id: new FormControl(
        { value: userPantryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      timestamp: new FormControl(userPantryRawValue.timestamp),
      post: new FormControl(userPantryRawValue.post),
      user: new FormControl(userPantryRawValue.user),
    });
  }

  getUserPantry(form: UserPantryFormGroup): IUserPantry | NewUserPantry {
    return this.convertUserPantryRawValueToUserPantry(form.getRawValue() as UserPantryFormRawValue | NewUserPantryFormRawValue);
  }

  resetForm(form: UserPantryFormGroup, userPantry: UserPantryFormGroupInput): void {
    const userPantryRawValue = this.convertUserPantryToUserPantryRawValue({ ...this.getFormDefaults(), ...userPantry });
    form.reset(
      {
        ...userPantryRawValue,
        id: { value: userPantryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserPantryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timestamp: currentTime,
    };
  }

  private convertUserPantryRawValueToUserPantry(
    rawUserPantry: UserPantryFormRawValue | NewUserPantryFormRawValue
  ): IUserPantry | NewUserPantry {
    return {
      ...rawUserPantry,
      timestamp: dayjs(rawUserPantry.timestamp, DATE_TIME_FORMAT),
    };
  }

  private convertUserPantryToUserPantryRawValue(
    userPantry: IUserPantry | (Partial<NewUserPantry> & UserPantryFormDefaults)
  ): UserPantryFormRawValue | PartialWithRequiredKeyOf<NewUserPantryFormRawValue> {
    return {
      ...userPantry,
      timestamp: userPantry.timestamp ? userPantry.timestamp.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
