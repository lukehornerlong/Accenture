import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDietaryTags } from '../dietary-tags.model';
import { DietaryTagsService } from '../service/dietary-tags.service';

@Injectable({ providedIn: 'root' })
export class DietaryTagsRoutingResolveService implements Resolve<IDietaryTags | null> {
  constructor(protected service: DietaryTagsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDietaryTags | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((dietaryTags: HttpResponse<IDietaryTags>) => {
          if (dietaryTags.body) {
            return of(dietaryTags.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
