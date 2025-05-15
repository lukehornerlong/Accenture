import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAllergens, NewAllergens } from '../allergens.model';

export type PartialUpdateAllergens = Partial<IAllergens> & Pick<IAllergens, 'id'>;

export type EntityResponseType = HttpResponse<IAllergens>;
export type EntityArrayResponseType = HttpResponse<IAllergens[]>;

@Injectable({ providedIn: 'root' })
export class AllergensService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/allergens');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(allergens: NewAllergens): Observable<EntityResponseType> {
    return this.http.post<IAllergens>(this.resourceUrl, allergens, { observe: 'response' });
  }

  update(allergens: IAllergens): Observable<EntityResponseType> {
    return this.http.put<IAllergens>(`${this.resourceUrl}/${this.getAllergensIdentifier(allergens)}`, allergens, { observe: 'response' });
  }

  partialUpdate(allergens: PartialUpdateAllergens): Observable<EntityResponseType> {
    return this.http.patch<IAllergens>(`${this.resourceUrl}/${this.getAllergensIdentifier(allergens)}`, allergens, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAllergens>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAllergens[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAllergensIdentifier(allergens: Pick<IAllergens, 'id'>): number {
    return allergens.id;
  }

  compareAllergens(o1: Pick<IAllergens, 'id'> | null, o2: Pick<IAllergens, 'id'> | null): boolean {
    return o1 && o2 ? this.getAllergensIdentifier(o1) === this.getAllergensIdentifier(o2) : o1 === o2;
  }

  addAllergensToCollectionIfMissing<Type extends Pick<IAllergens, 'id'>>(
    allergensCollection: Type[],
    ...allergensToCheck: (Type | null | undefined)[]
  ): Type[] {
    const allergens: Type[] = allergensToCheck.filter(isPresent);
    if (allergens.length > 0) {
      const allergensCollectionIdentifiers = allergensCollection.map(allergensItem => this.getAllergensIdentifier(allergensItem)!);
      const allergensToAdd = allergens.filter(allergensItem => {
        const allergensIdentifier = this.getAllergensIdentifier(allergensItem);
        if (allergensCollectionIdentifiers.includes(allergensIdentifier)) {
          return false;
        }
        allergensCollectionIdentifiers.push(allergensIdentifier);
        return true;
      });
      return [...allergensToAdd, ...allergensCollection];
    }
    return allergensCollection;
  }
}
