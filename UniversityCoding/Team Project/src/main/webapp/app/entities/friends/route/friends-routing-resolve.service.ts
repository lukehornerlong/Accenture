import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFriends } from '../friends.model';
import { FriendsService } from '../service/friends.service';

@Injectable({ providedIn: 'root' })
export class FriendsRoutingResolveService implements Resolve<IFriends | null> {
  constructor(protected service: FriendsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFriends | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((friends: HttpResponse<IFriends>) => {
          if (friends.body) {
            return of(friends.body);
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
