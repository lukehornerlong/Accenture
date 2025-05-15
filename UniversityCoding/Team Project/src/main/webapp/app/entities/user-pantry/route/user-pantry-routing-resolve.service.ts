import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserPantry } from '../user-pantry.model';
import { UserPantryService } from '../service/user-pantry.service';

@Injectable({ providedIn: 'root' })
export class UserPantryRoutingResolveService implements Resolve<IUserPantry | null> {
  constructor(protected service: UserPantryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserPantry | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userPantry: HttpResponse<IUserPantry>) => {
          if (userPantry.body) {
            return of(userPantry.body);
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
