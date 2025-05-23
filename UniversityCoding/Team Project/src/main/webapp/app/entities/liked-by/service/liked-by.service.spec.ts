import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILikedBy } from '../liked-by.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../liked-by.test-samples';

import { LikedByService } from './liked-by.service';

const requireRestSample: ILikedBy = {
  ...sampleWithRequiredData,
};

describe('LikedBy Service', () => {
  let service: LikedByService;
  let httpMock: HttpTestingController;
  let expectedResult: ILikedBy | ILikedBy[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LikedByService);
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

    it('should create a LikedBy', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const likedBy = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(likedBy).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LikedBy', () => {
      const likedBy = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(likedBy).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LikedBy', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LikedBy', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LikedBy', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLikedByToCollectionIfMissing', () => {
      it('should add a LikedBy to an empty array', () => {
        const likedBy: ILikedBy = sampleWithRequiredData;
        expectedResult = service.addLikedByToCollectionIfMissing([], likedBy);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(likedBy);
      });

      it('should not add a LikedBy to an array that contains it', () => {
        const likedBy: ILikedBy = sampleWithRequiredData;
        const likedByCollection: ILikedBy[] = [
          {
            ...likedBy,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLikedByToCollectionIfMissing(likedByCollection, likedBy);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LikedBy to an array that doesn't contain it", () => {
        const likedBy: ILikedBy = sampleWithRequiredData;
        const likedByCollection: ILikedBy[] = [sampleWithPartialData];
        expectedResult = service.addLikedByToCollectionIfMissing(likedByCollection, likedBy);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(likedBy);
      });

      it('should add only unique LikedBy to an array', () => {
        const likedByArray: ILikedBy[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const likedByCollection: ILikedBy[] = [sampleWithRequiredData];
        expectedResult = service.addLikedByToCollectionIfMissing(likedByCollection, ...likedByArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const likedBy: ILikedBy = sampleWithRequiredData;
        const likedBy2: ILikedBy = sampleWithPartialData;
        expectedResult = service.addLikedByToCollectionIfMissing([], likedBy, likedBy2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(likedBy);
        expect(expectedResult).toContain(likedBy2);
      });

      it('should accept null and undefined values', () => {
        const likedBy: ILikedBy = sampleWithRequiredData;
        expectedResult = service.addLikedByToCollectionIfMissing([], null, likedBy, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(likedBy);
      });

      it('should return initial array if no LikedBy is added', () => {
        const likedByCollection: ILikedBy[] = [sampleWithRequiredData];
        expectedResult = service.addLikedByToCollectionIfMissing(likedByCollection, undefined, null);
        expect(expectedResult).toEqual(likedByCollection);
      });
    });

    describe('compareLikedBy', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLikedBy(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLikedBy(entity1, entity2);
        const compareResult2 = service.compareLikedBy(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLikedBy(entity1, entity2);
        const compareResult2 = service.compareLikedBy(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLikedBy(entity1, entity2);
        const compareResult2 = service.compareLikedBy(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
