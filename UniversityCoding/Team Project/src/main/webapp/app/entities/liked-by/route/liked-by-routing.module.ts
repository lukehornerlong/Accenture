import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LikedByComponent } from '../list/liked-by.component';
import { LikedByDetailComponent } from '../detail/liked-by-detail.component';
import { LikedByUpdateComponent } from '../update/liked-by-update.component';
import { LikedByRoutingResolveService } from './liked-by-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const likedByRoute: Routes = [
  {
    path: '',
    component: LikedByComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LikedByDetailComponent,
    resolve: {
      likedBy: LikedByRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LikedByUpdateComponent,
    resolve: {
      likedBy: LikedByRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LikedByUpdateComponent,
    resolve: {
      likedBy: LikedByRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(likedByRoute)],
  exports: [RouterModule],
})
export class LikedByRoutingModule {}
