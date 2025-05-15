import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILikedBy, NewLikedBy } from '../liked-by.model';
import { IPost } from 'app/entities/post/post.model';
import { IUser } from 'app/entities/user/user.model';

export type PartialUpdateLikedBy = Partial<ILikedBy> & Pick<ILikedBy, 'id'>;

export type EntityResponseType = HttpResponse<ILikedBy>;
export type EntityArrayResponseType = HttpResponse<ILikedBy[]>;

@Injectable({ providedIn: 'root' })
export class LikedByService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/liked-bies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(likedBy: NewLikedBy): Observable<EntityResponseType> {
    return this.http.post<ILikedBy>(this.resourceUrl, likedBy, { observe: 'response' });
  }

  update(likedBy: ILikedBy): Observable<EntityResponseType> {
    return this.http.put<ILikedBy>(`${this.resourceUrl}/${this.getLikedByIdentifier(likedBy)}`, likedBy, { observe: 'response' });
  }

  partialUpdate(likedBy: PartialUpdateLikedBy): Observable<EntityResponseType> {
    return this.http.patch<ILikedBy>(`${this.resourceUrl}/${this.getLikedByIdentifier(likedBy)}`, likedBy, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILikedBy>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPostToLikedBy(post: IPost, user: IUser, liked: boolean): Observable<ILikedBy> {
    const likedByObj = {
      post,
      user: user,
      liked,
    };
    return this.http.post<ILikedBy>(this.resourceUrl, likedByObj);
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILikedBy[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLikedByIdentifier(likedBy: Pick<ILikedBy, 'id'>): number {
    return likedBy.id;
  }

  compareLikedBy(o1: Pick<ILikedBy, 'id'> | null, o2: Pick<ILikedBy, 'id'> | null): boolean {
    return o1 && o2 ? this.getLikedByIdentifier(o1) === this.getLikedByIdentifier(o2) : o1 === o2;
  }

  addLikedByToCollectionIfMissing<Type extends Pick<ILikedBy, 'id'>>(
    likedByCollection: Type[],
    ...likedBiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const likedBies: Type[] = likedBiesToCheck.filter(isPresent);
    if (likedBies.length > 0) {
      const likedByCollectionIdentifiers = likedByCollection.map(likedByItem => this.getLikedByIdentifier(likedByItem)!);
      const likedBiesToAdd = likedBies.filter(likedByItem => {
        const likedByIdentifier = this.getLikedByIdentifier(likedByItem);
        if (likedByCollectionIdentifiers.includes(likedByIdentifier)) {
          return false;
        }
        likedByCollectionIdentifiers.push(likedByIdentifier);
        return true;
      });
      return [...likedBiesToAdd, ...likedByCollection];
    }
    return likedByCollection;
  }
}
