import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-pantry.test-samples';

import { UserPantryFormService } from './user-pantry-form.service';

describe('UserPantry Form Service', () => {
  let service: UserPantryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPantryFormService);
  });

  describe('Service methods', () => {
    describe('createUserPantryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserPantryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            timestamp: expect.any(Object),
            post: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IUserPantry should create a new form with FormGroup', () => {
        const formGroup = service.createUserPantryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            timestamp: expect.any(Object),
            post: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getUserPantry', () => {
      it('should return NewUserPantry for default UserPantry initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserPantryFormGroup(sampleWithNewData);

        const userPantry = service.getUserPantry(formGroup) as any;

        expect(userPantry).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserPantry for empty UserPantry initial value', () => {
        const formGroup = service.createUserPantryFormGroup();

        const userPantry = service.getUserPantry(formGroup) as any;

        expect(userPantry).toMatchObject({});
      });

      it('should return IUserPantry', () => {
        const formGroup = service.createUserPantryFormGroup(sampleWithRequiredData);

        const userPantry = service.getUserPantry(formGroup) as any;

        expect(userPantry).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserPantry should not enable id FormControl', () => {
        const formGroup = service.createUserPantryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserPantry should disable id FormControl', () => {
        const formGroup = service.createUserPantryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
