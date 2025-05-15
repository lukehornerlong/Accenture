import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../dietary-tags.test-samples';

import { DietaryTagsFormService } from './dietary-tags-form.service';

describe('DietaryTags Form Service', () => {
  let service: DietaryTagsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DietaryTagsFormService);
  });

  describe('Service methods', () => {
    describe('createDietaryTagsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDietaryTagsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dietary: expect.any(Object),
            posts: expect.any(Object),
          })
        );
      });

      it('passing IDietaryTags should create a new form with FormGroup', () => {
        const formGroup = service.createDietaryTagsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dietary: expect.any(Object),
            posts: expect.any(Object),
          })
        );
      });
    });

    describe('getDietaryTags', () => {
      it('should return NewDietaryTags for default DietaryTags initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDietaryTagsFormGroup(sampleWithNewData);

        const dietaryTags = service.getDietaryTags(formGroup) as any;

        expect(dietaryTags).toMatchObject(sampleWithNewData);
      });

      it('should return NewDietaryTags for empty DietaryTags initial value', () => {
        const formGroup = service.createDietaryTagsFormGroup();

        const dietaryTags = service.getDietaryTags(formGroup) as any;

        expect(dietaryTags).toMatchObject({});
      });

      it('should return IDietaryTags', () => {
        const formGroup = service.createDietaryTagsFormGroup(sampleWithRequiredData);

        const dietaryTags = service.getDietaryTags(formGroup) as any;

        expect(dietaryTags).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDietaryTags should not enable id FormControl', () => {
        const formGroup = service.createDietaryTagsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDietaryTags should disable id FormControl', () => {
        const formGroup = service.createDietaryTagsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
