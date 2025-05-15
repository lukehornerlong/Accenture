import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../allergens.test-samples';

import { AllergensFormService } from './allergens-form.service';

describe('Allergens Form Service', () => {
  let service: AllergensFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllergensFormService);
  });

  describe('Service methods', () => {
    describe('createAllergensFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAllergensFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            celery: expect.any(Object),
            gluten: expect.any(Object),
            crustaceans: expect.any(Object),
            egg: expect.any(Object),
            fish: expect.any(Object),
            lupin: expect.any(Object),
            milk: expect.any(Object),
            molluscs: expect.any(Object),
            mustard: expect.any(Object),
            nuts: expect.any(Object),
            peanuts: expect.any(Object),
            sesame: expect.any(Object),
            soya: expect.any(Object),
            sulphur: expect.any(Object),
            user: expect.any(Object),
            post: expect.any(Object),
          })
        );
      });

      it('passing IAllergens should create a new form with FormGroup', () => {
        const formGroup = service.createAllergensFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            celery: expect.any(Object),
            gluten: expect.any(Object),
            crustaceans: expect.any(Object),
            egg: expect.any(Object),
            fish: expect.any(Object),
            lupin: expect.any(Object),
            milk: expect.any(Object),
            molluscs: expect.any(Object),
            mustard: expect.any(Object),
            nuts: expect.any(Object),
            peanuts: expect.any(Object),
            sesame: expect.any(Object),
            soya: expect.any(Object),
            sulphur: expect.any(Object),
            user: expect.any(Object),
            post: expect.any(Object),
          })
        );
      });
    });

    describe('getAllergens', () => {
      it('should return NewAllergens for default Allergens initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAllergensFormGroup(sampleWithNewData);

        const allergens = service.getAllergens(formGroup) as any;

        expect(allergens).toMatchObject(sampleWithNewData);
      });

      it('should return NewAllergens for empty Allergens initial value', () => {
        const formGroup = service.createAllergensFormGroup();

        const allergens = service.getAllergens(formGroup) as any;

        expect(allergens).toMatchObject({});
      });

      it('should return IAllergens', () => {
        const formGroup = service.createAllergensFormGroup(sampleWithRequiredData);

        const allergens = service.getAllergens(formGroup) as any;

        expect(allergens).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAllergens should not enable id FormControl', () => {
        const formGroup = service.createAllergensFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAllergens should disable id FormControl', () => {
        const formGroup = service.createAllergensFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
