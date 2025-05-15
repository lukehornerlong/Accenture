import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDietaryTags } from '../dietary-tags.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../dietary-tags.test-samples';

import { DietaryTagsService } from './dietary-tags.service';

const requireRestSample: IDietaryTags = {
  ...sampleWithRequiredData,
};

describe('DietaryTags Service', () => {
  let service: DietaryTagsService;
  let httpMock: HttpTestingController;
  let expectedResult: IDietaryTags | IDietaryTags[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DietaryTagsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a DietaryTags', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const dietaryTags = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(dietaryTags).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DietaryTags', () => {
      const dietaryTags = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(dietaryTags).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DietaryTags', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DietaryTags', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DietaryTags', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDietaryTagsToCollectionIfMissing', () => {
      it('should add a DietaryTags to an empty array', () => {
        const dietaryTags: IDietaryTags = sampleWithRequiredData;
        expectedResult = service.addDietaryTagsToCollectionIfMissing([], dietaryTags);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(dietaryTags);
      });

      it('should not add a DietaryTags to an array that contains it', () => {
        const dietaryTags: IDietaryTags = sampleWithRequiredData;
        const dietaryTagsCollection: IDietaryTags[] = [
          {
            ...dietaryTags,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDietaryTagsToCollectionIfMissing(dietaryTagsCollection, dietaryTags);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DietaryTags to an array that doesn't contain it", () => {
        const dietaryTags: IDietaryTags = sampleWithRequiredData;
        const dietaryTagsCollection: IDietaryTags[] = [sampleWithPartialData];
        expectedResult = service.addDietaryTagsToCollectionIfMissing(dietaryTagsCollection, dietaryTags);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(dietaryTags);
      });

      it('should add only unique DietaryTags to an array', () => {
        const dietaryTagsArray: IDietaryTags[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const dietaryTagsCollection: IDietaryTags[] = [sampleWithRequiredData];
        expectedResult = service.addDietaryTagsToCollectionIfMissing(dietaryTagsCollection, ...dietaryTagsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const dietaryTags: IDietaryTags = sampleWithRequiredData;
        const dietaryTags2: IDietaryTags = sampleWithPartialData;
        expectedResult = service.addDietaryTagsToCollectionIfMissing([], dietaryTags, dietaryTags2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(dietaryTags);
        expect(expectedResult).toContain(dietaryTags2);
      });

      it('should accept null and undefined values', () => {
        const dietaryTags: IDietaryTags = sampleWithRequiredData;
        expectedResult = service.addDietaryTagsToCollectionIfMissing([], null, dietaryTags, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(dietaryTags);
      });

      it('should return initial array if no DietaryTags is added', () => {
        const dietaryTagsCollection: IDietaryTags[] = [sampleWithRequiredData];
        expectedResult = service.addDietaryTagsToCollectionIfMissing(dietaryTagsCollection, undefined, null);
        expect(expectedResult).toEqual(dietaryTagsCollection);
      });
    });

    describe('compareDietaryTags', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDietaryTags(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDietaryTags(entity1, entity2);
        const compareResult2 = service.compareDietaryTags(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDietaryTags(entity1, entity2);
        const compareResult2 = service.compareDietaryTags(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDietaryTags(entity1, entity2);
        const compareResult2 = service.compareDietaryTags(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
