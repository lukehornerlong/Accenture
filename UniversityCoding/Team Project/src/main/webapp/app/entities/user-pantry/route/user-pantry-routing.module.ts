import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserPantryComponent } from '../list/user-pantry.component';
import { UserPantryDetailComponent } from '../detail/user-pantry-detail.component';
import { UserPantryUpdateComponent } from '../update/user-pantry-update.component';
import { UserPantryRoutingResolveService } from './user-pantry-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userPantryRoute: Routes = [
  {
    path: '',
    component: UserPantryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserPantryDetailComponent,
    resolve: {
      userPantry: UserPantryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserPantryUpdateComponent,
    resolve: {
      userPantry: UserPantryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserPantryUpdateComponent,
    resolve: {
      userPantry: UserPantryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userPantryRoute)],
  exports: [RouterModule],
})
export class UserPantryRoutingModule {}
