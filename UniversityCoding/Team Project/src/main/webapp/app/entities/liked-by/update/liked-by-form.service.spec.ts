import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../liked-by.test-samples';

import { LikedByFormService } from './liked-by-form.service';

describe('LikedBy Form Service', () => {
  let service: LikedByFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LikedByFormService);
  });

  describe('Service methods', () => {
    describe('createLikedByFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLikedByFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            liked: expect.any(Object),
            post: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing ILikedBy should create a new form with FormGroup', () => {
        const formGroup = service.createLikedByFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            liked: expect.any(Object),
            post: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getLikedBy', () => {
      it('should return NewLikedBy for default LikedBy initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLikedByFormGroup(sampleWithNewData);

        const likedBy = service.getLikedBy(formGroup) as any;

        expect(likedBy).toMatchObject(sampleWithNewData);
      });

      it('should return NewLikedBy for empty LikedBy initial value', () => {
        const formGroup = service.createLikedByFormGroup();

        const likedBy = service.getLikedBy(formGroup) as any;

        expect(likedBy).toMatchObject({});
      });

      it('should return ILikedBy', () => {
        const formGroup = service.createLikedByFormGroup(sampleWithRequiredData);

        const likedBy = service.getLikedBy(formGroup) as any;

        expect(likedBy).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILikedBy should not enable id FormControl', () => {
        const formGroup = service.createLikedByFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLikedBy should disable id FormControl', () => {
        const formGroup = service.createLikedByFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
