import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FriendsComponent } from '../list/friends.component';
import { FriendsDetailComponent } from '../detail/friends-detail.component';
import { FriendsUpdateComponent } from '../update/friends-update.component';
import { FriendsRoutingResolveService } from './friends-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const friendsRoute: Routes = [
  {
    path: '',
    component: FriendsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FriendsDetailComponent,
    resolve: {
      friends: FriendsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FriendsUpdateComponent,
    resolve: {
      friends: FriendsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FriendsUpdateComponent,
    resolve: {
      friends: FriendsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(friendsRoute)],
  exports: [RouterModule],
})
export class FriendsRoutingModule {}
