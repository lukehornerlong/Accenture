import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserPantry } from '../user-pantry.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-pantry.test-samples';

import { UserPantryService, RestUserPantry } from './user-pantry.service';

const requireRestSample: RestUserPantry = {
  ...sampleWithRequiredData,
  timestamp: sampleWithRequiredData.timestamp?.toJSON(),
};

describe('UserPantry Service', () => {
  let service: UserPantryService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserPantry | IUserPantry[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserPantryService);
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

    it('should create a UserPantry', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userPantry = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userPantry).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserPantry', () => {
      const userPantry = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userPantry).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserPantry', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserPantry', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserPantry', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserPantryToCollectionIfMissing', () => {
      it('should add a UserPantry to an empty array', () => {
        const userPantry: IUserPantry = sampleWithRequiredData;
        expectedResult = service.addUserPantryToCollectionIfMissing([], userPantry);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userPantry);
      });

      it('should not add a UserPantry to an array that contains it', () => {
        const userPantry: IUserPantry = sampleWithRequiredData;
        const userPantryCollection: IUserPantry[] = [
          {
            ...userPantry,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserPantryToCollectionIfMissing(userPantryCollection, userPantry);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserPantry to an array that doesn't contain it", () => {
        const userPantry: IUserPantry = sampleWithRequiredData;
        const userPantryCollection: IUserPantry[] = [sampleWithPartialData];
        expectedResult = service.addUserPantryToCollectionIfMissing(userPantryCollection, userPantry);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userPantry);
      });

      it('should add only unique UserPantry to an array', () => {
        const userPantryArray: IUserPantry[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userPantryCollection: IUserPantry[] = [sampleWithRequiredData];
        expectedResult = service.addUserPantryToCollectionIfMissing(userPantryCollection, ...userPantryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userPantry: IUserPantry = sampleWithRequiredData;
        const userPantry2: IUserPantry = sampleWithPartialData;
        expectedResult = service.addUserPantryToCollectionIfMissing([], userPantry, userPantry2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userPantry);
        expect(expectedResult).toContain(userPantry2);
      });

      it('should accept null and undefined values', () => {
        const userPantry: IUserPantry = sampleWithRequiredData;
        expectedResult = service.addUserPantryToCollectionIfMissing([], null, userPantry, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userPantry);
      });

      it('should return initial array if no UserPantry is added', () => {
        const userPantryCollection: IUserPantry[] = [sampleWithRequiredData];
        expectedResult = service.addUserPantryToCollectionIfMissing(userPantryCollection, undefined, null);
        expect(expectedResult).toEqual(userPantryCollection);
      });
    });

    describe('compareUserPantry', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserPantry(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserPantry(entity1, entity2);
        const compareResult2 = service.compareUserPantry(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserPantry(entity1, entity2);
        const compareResult2 = service.compareUserPantry(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserPantry(entity1, entity2);
        const compareResult2 = service.compareUserPantry(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
