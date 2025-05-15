import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDietaryTags, NewDietaryTags } from '../dietary-tags.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDietaryTags for edit and NewDietaryTagsFormGroupInput for create.
 */
type DietaryTagsFormGroupInput = IDietaryTags | PartialWithRequiredKeyOf<NewDietaryTags>;

type DietaryTagsFormDefaults = Pick<NewDietaryTags, 'id' | 'posts'>;

type DietaryTagsFormGroupContent = {
  id: FormControl<IDietaryTags['id'] | NewDietaryTags['id']>;
  dietary: FormControl<IDietaryTags['dietary']>;
  posts: FormControl<IDietaryTags['posts']>;
};

export type DietaryTagsFormGroup = FormGroup<DietaryTagsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DietaryTagsFormService {
  createDietaryTagsFormGroup(dietaryTags: DietaryTagsFormGroupInput = { id: null }): DietaryTagsFormGroup {
    const dietaryTagsRawValue = {
      ...this.getFormDefaults(),
      ...dietaryTags,
    };
    return new FormGroup<DietaryTagsFormGroupContent>({
      id: new FormControl(
        { value: dietaryTagsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      dietary: new FormControl(dietaryTagsRawValue.dietary),
      posts: new FormControl(dietaryTagsRawValue.posts ?? []),
    });
  }

  getDietaryTags(form: DietaryTagsFormGroup): IDietaryTags | NewDietaryTags {
    return form.getRawValue() as IDietaryTags | NewDietaryTags;
  }

  resetForm(form: DietaryTagsFormGroup, dietaryTags: DietaryTagsFormGroupInput): void {
    const dietaryTagsRawValue = { ...this.getFormDefaults(), ...dietaryTags };
    form.reset(
      {
        ...dietaryTagsRawValue,
        id: { value: dietaryTagsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DietaryTagsFormDefaults {
    return {
      id: null,
      posts: [],
    };
  }
}
