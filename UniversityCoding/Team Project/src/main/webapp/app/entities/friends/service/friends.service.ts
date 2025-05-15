import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFriends, NewFriends } from '../friends.model';
import { IUser } from 'app/entities/user/user.model';

export type PartialUpdateFriends = Partial<IFriends> & Pick<IFriends, 'id'>;

export type EntityResponseType = HttpResponse<IFriends>;
export type EntityArrayResponseType = HttpResponse<IFriends[]>;

@Injectable({ providedIn: 'root' })
export class FriendsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/friends');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(friends: NewFriends): Observable<EntityResponseType> {
    return this.http.post<IFriends>(this.resourceUrl, friends, { observe: 'response' });
  }

  update(friends: IFriends): Observable<EntityResponseType> {
    return this.http.put<IFriends>(`${this.resourceUrl}/${this.getFriendsIdentifier(friends)}`, friends, { observe: 'response' });
  }

  partialUpdate(friends: PartialUpdateFriends): Observable<EntityResponseType> {
    return this.http.patch<IFriends>(`${this.resourceUrl}/${this.getFriendsIdentifier(friends)}`, friends, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFriends>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  deleteFriendship(friendshipId: number): Observable<any> {
    return this.http.delete(`${this.resourceUrl}/${friendshipId}`);
  }

  getUserFriends(userId: number): Observable<IFriends[]> {
    return this.http.get<IFriends[]>(`${this.resourceUrl}/user/${userId}`);
  }

  getUserFollowers(userId: number): Observable<IFriends[]> {
    return this.http.get<IFriends[]>(`${this.resourceUrl}/follower/${userId}`);
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFriends[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFriendsIdentifier(friends: Pick<IFriends, 'id'>): number {
    return friends.id;
  }

  compareFriends(o1: Pick<IFriends, 'id'> | null, o2: Pick<IFriends, 'id'> | null): boolean {
    return o1 && o2 ? this.getFriendsIdentifier(o1) === this.getFriendsIdentifier(o2) : o1 === o2;
  }

  addFriendsToCollectionIfMissing<Type extends Pick<IFriends, 'id'>>(
    friendsCollection: Type[],
    ...friendsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const friends: Type[] = friendsToCheck.filter(isPresent);
    if (friends.length > 0) {
      const friendsCollectionIdentifiers = friendsCollection.map(friendsItem => this.getFriendsIdentifier(friendsItem)!);
      const friendsToAdd = friends.filter(friendsItem => {
        const friendsIdentifier = this.getFriendsIdentifier(friendsItem);
        if (friendsCollectionIdentifiers.includes(friendsIdentifier)) {
          return false;
        }
        friendsCollectionIdentifiers.push(friendsIdentifier);
        return true;
      });
      return [...friendsToAdd, ...friendsCollection];
    }
    return friendsCollection;
  }
}
