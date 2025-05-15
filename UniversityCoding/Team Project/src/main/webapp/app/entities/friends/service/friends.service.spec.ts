import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFriends } from '../friends.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../friends.test-samples';

import { FriendsService } from './friends.service';

const requireRestSample: IFriends = {
  ...sampleWithRequiredData,
};

describe('Friends Service', () => {
  let service: FriendsService;
  let httpMock: HttpTestingController;
  let expectedResult: IFriends | IFriends[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FriendsService);
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

    it('should create a Friends', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const friends = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(friends).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Friends', () => {
      const friends = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(friends).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Friends', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Friends', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Friends', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFriendsToCollectionIfMissing', () => {
      it('should add a Friends to an empty array', () => {
        const friends: IFriends = sampleWithRequiredData;
        expectedResult = service.addFriendsToCollectionIfMissing([], friends);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(friends);
      });

      it('should not add a Friends to an array that contains it', () => {
        const friends: IFriends = sampleWithRequiredData;
        const friendsCollection: IFriends[] = [
          {
            ...friends,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFriendsToCollectionIfMissing(friendsCollection, friends);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Friends to an array that doesn't contain it", () => {
        const friends: IFriends = sampleWithRequiredData;
        const friendsCollection: IFriends[] = [sampleWithPartialData];
        expectedResult = service.addFriendsToCollectionIfMissing(friendsCollection, friends);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(friends);
      });

      it('should add only unique Friends to an array', () => {
        const friendsArray: IFriends[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const friendsCollection: IFriends[] = [sampleWithRequiredData];
        expectedResult = service.addFriendsToCollectionIfMissing(friendsCollection, ...friendsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const friends: IFriends = sampleWithRequiredData;
        const friends2: IFriends = sampleWithPartialData;
        expectedResult = service.addFriendsToCollectionIfMissing([], friends, friends2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(friends);
        expect(expectedResult).toContain(friends2);
      });

      it('should accept null and undefined values', () => {
        const friends: IFriends = sampleWithRequiredData;
        expectedResult = service.addFriendsToCollectionIfMissing([], null, friends, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(friends);
      });

      it('should return initial array if no Friends is added', () => {
        const friendsCollection: IFriends[] = [sampleWithRequiredData];
        expectedResult = service.addFriendsToCollectionIfMissing(friendsCollection, undefined, null);
        expect(expectedResult).toEqual(friendsCollection);
      });
    });

    describe('compareFriends', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFriends(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFriends(entity1, entity2);
        const compareResult2 = service.compareFriends(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFriends(entity1, entity2);
        const compareResult2 = service.compareFriends(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFriends(entity1, entity2);
        const compareResult2 = service.compareFriends(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
