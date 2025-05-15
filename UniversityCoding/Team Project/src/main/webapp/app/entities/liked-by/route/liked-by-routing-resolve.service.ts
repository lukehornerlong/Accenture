import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILikedBy } from '../liked-by.model';
import { LikedByService } from '../service/liked-by.service';

@Injectable({ providedIn: 'root' })
export class LikedByRoutingResolveService implements Resolve<ILikedBy | null> {
  constructor(protected service: LikedByService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILikedBy | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((likedBy: HttpResponse<ILikedBy>) => {
          if (likedBy.body) {
            return of(likedBy.body);
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
