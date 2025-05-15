import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDietaryTags, NewDietaryTags } from '../dietary-tags.model';

export type PartialUpdateDietaryTags = Partial<IDietaryTags> & Pick<IDietaryTags, 'id'>;

export type EntityResponseType = HttpResponse<IDietaryTags>;
export type EntityArrayResponseType = HttpResponse<IDietaryTags[]>;

@Injectable({ providedIn: 'root' })
export class DietaryTagsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/dietary-tags');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(dietaryTags: NewDietaryTags): Observable<EntityResponseType> {
    return this.http.post<IDietaryTags>(this.resourceUrl, dietaryTags, { observe: 'response' });
  }

  update(dietaryTags: IDietaryTags): Observable<EntityResponseType> {
    return this.http.put<IDietaryTags>(`${this.resourceUrl}/${this.getDietaryTagsIdentifier(dietaryTags)}`, dietaryTags, {
      observe: 'response',
    });
  }

  partialUpdate(dietaryTags: PartialUpdateDietaryTags): Observable<EntityResponseType> {
    return this.http.patch<IDietaryTags>(`${this.resourceUrl}/${this.getDietaryTagsIdentifier(dietaryTags)}`, dietaryTags, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDietaryTags>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDietaryTags[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDietaryTagsIdentifier(dietaryTags: Pick<IDietaryTags, 'id'>): number {
    return dietaryTags.id;
  }

  compareDietaryTags(o1: Pick<IDietaryTags, 'id'> | null, o2: Pick<IDietaryTags, 'id'> | null): boolean {
    return o1 && o2 ? this.getDietaryTagsIdentifier(o1) === this.getDietaryTagsIdentifier(o2) : o1 === o2;
  }

  addDietaryTagsToCollectionIfMissing<Type extends Pick<IDietaryTags, 'id'>>(
    dietaryTagsCollection: Type[],
    ...dietaryTagsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const dietaryTags: Type[] = dietaryTagsToCheck.filter(isPresent);
    if (dietaryTags.length > 0) {
      const dietaryTagsCollectionIdentifiers = dietaryTagsCollection.map(
        dietaryTagsItem => this.getDietaryTagsIdentifier(dietaryTagsItem)!
      );
      const dietaryTagsToAdd = dietaryTags.filter(dietaryTagsItem => {
        const dietaryTagsIdentifier = this.getDietaryTagsIdentifier(dietaryTagsItem);
        if (dietaryTagsCollectionIdentifiers.includes(dietaryTagsIdentifier)) {
          return false;
        }
        dietaryTagsCollectionIdentifiers.push(dietaryTagsIdentifier);
        return true;
      });
      return [...dietaryTagsToAdd, ...dietaryTagsCollection];
    }
    return dietaryTagsCollection;
  }
}
