import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAllergens, NewAllergens } from '../allergens.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAllergens for edit and NewAllergensFormGroupInput for create.
 */
type AllergensFormGroupInput = IAllergens | PartialWithRequiredKeyOf<NewAllergens>;

type AllergensFormDefaults = Pick<
  NewAllergens,
  | 'id'
  | 'celery'
  | 'gluten'
  | 'crustaceans'
  | 'egg'
  | 'fish'
  | 'lupin'
  | 'milk'
  | 'molluscs'
  | 'mustard'
  | 'nuts'
  | 'peanuts'
  | 'sesame'
  | 'soya'
  | 'sulphur'
>;

type AllergensFormGroupContent = {
  id: FormControl<IAllergens['id'] | NewAllergens['id']>;
  celery: FormControl<IAllergens['celery']>;
  gluten: FormControl<IAllergens['gluten']>;
  crustaceans: FormControl<IAllergens['crustaceans']>;
  egg: FormControl<IAllergens['egg']>;
  fish: FormControl<IAllergens['fish']>;
  lupin: FormControl<IAllergens['lupin']>;
  milk: FormControl<IAllergens['milk']>;
  molluscs: FormControl<IAllergens['molluscs']>;
  mustard: FormControl<IAllergens['mustard']>;
  nuts: FormControl<IAllergens['nuts']>;
  peanuts: FormControl<IAllergens['peanuts']>;
  sesame: FormControl<IAllergens['sesame']>;
  soya: FormControl<IAllergens['soya']>;
  sulphur: FormControl<IAllergens['sulphur']>;
  user: FormControl<IAllergens['user']>;
  post: FormControl<IAllergens['post']>;
};

export type AllergensFormGroup = FormGroup<AllergensFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AllergensFormService {
  createAllergensFormGroup(allergens: AllergensFormGroupInput = { id: null }): AllergensFormGroup {
    const allergensRawValue = {
      ...this.getFormDefaults(),
      ...allergens,
    };
    return new FormGroup<AllergensFormGroupContent>({
      id: new FormControl(
        { value: allergensRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      celery: new FormControl(allergensRawValue.celery),
      gluten: new FormControl(allergensRawValue.gluten),
      crustaceans: new FormControl(allergensRawValue.crustaceans),
      egg: new FormControl(allergensRawValue.egg),
      fish: new FormControl(allergensRawValue.fish),
      lupin: new FormControl(allergensRawValue.lupin),
      milk: new FormControl(allergensRawValue.milk),
      molluscs: new FormControl(allergensRawValue.molluscs),
      mustard: new FormControl(allergensRawValue.mustard),
      nuts: new FormControl(allergensRawValue.nuts),
      peanuts: new FormControl(allergensRawValue.peanuts),
      sesame: new FormControl(allergensRawValue.sesame),
      soya: new FormControl(allergensRawValue.soya),
      sulphur: new FormControl(allergensRawValue.sulphur),
      user: new FormControl(allergensRawValue.user),
      post: new FormControl(allergensRawValue.post),
    });
  }

  getAllergens(form: AllergensFormGroup): IAllergens | NewAllergens {
    return form.getRawValue() as IAllergens | NewAllergens;
  }

  resetForm(form: AllergensFormGroup, allergens: AllergensFormGroupInput): void {
    const allergensRawValue = { ...this.getFormDefaults(), ...allergens };
    form.reset(
      {
        ...allergensRawValue,
        id: { value: allergensRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AllergensFormDefaults {
    return {
      id: null,
      celery: false,
      gluten: false,
      crustaceans: false,
      egg: false,
      fish: false,
      lupin: false,
      milk: false,
      molluscs: false,
      mustard: false,
      nuts: false,
      peanuts: false,
      sesame: false,
      soya: false,
      sulphur: false,
    };
  }
}
