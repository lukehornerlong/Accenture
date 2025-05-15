import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserPantry, NewUserPantry } from '../user-pantry.model';
import { IPost } from 'app/entities/post/post.model';
import { IUser } from 'app/entities/user/user.model';

export type PartialUpdateUserPantry = Partial<IUserPantry> & Pick<IUserPantry, 'id'>;

type RestOf<T extends IUserPantry | NewUserPantry> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

export type RestUserPantry = RestOf<IUserPantry>;

export type NewRestUserPantry = RestOf<NewUserPantry>;

export type PartialUpdateRestUserPantry = RestOf<PartialUpdateUserPantry>;

export type EntityResponseType = HttpResponse<IUserPantry>;
export type EntityArrayResponseType = HttpResponse<IUserPantry[]>;

@Injectable({ providedIn: 'root' })
export class UserPantryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-pantries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userPantry: NewUserPantry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userPantry);
    return this.http
      .post<RestUserPantry>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(userPantry: IUserPantry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userPantry);
    return this.http
      .put<RestUserPantry>(`${this.resourceUrl}/${this.getUserPantryIdentifier(userPantry)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  addPostToPantry(timestamp: dayjs.Dayjs, post: IPost, user: IUser): Observable<IUserPantry> {
    const userPantry = {
      timestamp,
      post,
      user,
    };
    return this.http.post<IUserPantry>(this.resourceUrl, userPantry);
  }

  partialUpdate(userPantry: PartialUpdateUserPantry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userPantry);
    return this.http
      .patch<RestUserPantry>(`${this.resourceUrl}/${this.getUserPantryIdentifier(userPantry)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestUserPantry>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestUserPantry[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserPantryIdentifier(userPantry: Pick<IUserPantry, 'id'>): number {
    return userPantry.id;
  }

  compareUserPantry(o1: Pick<IUserPantry, 'id'> | null, o2: Pick<IUserPantry, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserPantryIdentifier(o1) === this.getUserPantryIdentifier(o2) : o1 === o2;
  }

  addUserPantryToCollectionIfMissing<Type extends Pick<IUserPantry, 'id'>>(
    userPantryCollection: Type[],
    ...userPantriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userPantries: Type[] = userPantriesToCheck.filter(isPresent);
    if (userPantries.length > 0) {
      const userPantryCollectionIdentifiers = userPantryCollection.map(userPantryItem => this.getUserPantryIdentifier(userPantryItem)!);
      const userPantriesToAdd = userPantries.filter(userPantryItem => {
        const userPantryIdentifier = this.getUserPantryIdentifier(userPantryItem);
        if (userPantryCollectionIdentifiers.includes(userPantryIdentifier)) {
          return false;
        }
        userPantryCollectionIdentifiers.push(userPantryIdentifier);
        return true;
      });
      return [...userPantriesToAdd, ...userPantryCollection];
    }
    return userPantryCollection;
  }

  protected convertDateFromClient<T extends IUserPantry | NewUserPantry | PartialUpdateUserPantry>(userPantry: T): RestOf<T> {
    return {
      ...userPantry,
      timestamp: userPantry.timestamp?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restUserPantry: RestUserPantry): IUserPantry {
    return {
      ...restUserPantry,
      timestamp: restUserPantry.timestamp ? dayjs(restUserPantry.timestamp) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestUserPantry>): HttpResponse<IUserPantry> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestUserPantry[]>): HttpResponse<IUserPantry[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
