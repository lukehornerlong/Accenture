import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFriends, NewFriends } from '../friends.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFriends for edit and NewFriendsFormGroupInput for create.
 */
type FriendsFormGroupInput = IFriends | PartialWithRequiredKeyOf<NewFriends>;

type FriendsFormDefaults = Pick<NewFriends, 'id'>;

type FriendsFormGroupContent = {
  id: FormControl<IFriends['id'] | NewFriends['id']>;
  user_id1: FormControl<IFriends['user_id1']>;
  user_id2: FormControl<IFriends['user_id2']>;
};

export type FriendsFormGroup = FormGroup<FriendsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FriendsFormService {
  createFriendsFormGroup(friends: FriendsFormGroupInput = { id: null }): FriendsFormGroup {
    const friendsRawValue = {
      ...this.getFormDefaults(),
      ...friends,
    };
    return new FormGroup<FriendsFormGroupContent>({
      id: new FormControl(
        { value: friendsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      user_id1: new FormControl(friendsRawValue.user_id1),
      user_id2: new FormControl(friendsRawValue.user_id2),
    });
  }

  getFriends(form: FriendsFormGroup): IFriends | NewFriends {
    return form.getRawValue() as IFriends | NewFriends;
  }

  resetForm(form: FriendsFormGroup, friends: FriendsFormGroupInput): void {
    const friendsRawValue = { ...this.getFormDefaults(), ...friends };
    form.reset(
      {
        ...friendsRawValue,
        id: { value: friendsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FriendsFormDefaults {
    return {
      id: null,
    };
  }
}
