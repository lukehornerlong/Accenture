import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DietaryTagsComponent } from '../list/dietary-tags.component';
import { DietaryTagsDetailComponent } from '../detail/dietary-tags-detail.component';
import { DietaryTagsUpdateComponent } from '../update/dietary-tags-update.component';
import { DietaryTagsRoutingResolveService } from './dietary-tags-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const dietaryTagsRoute: Routes = [
  {
    path: '',
    component: DietaryTagsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DietaryTagsDetailComponent,
    resolve: {
      dietaryTags: DietaryTagsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DietaryTagsUpdateComponent,
    resolve: {
      dietaryTags: DietaryTagsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DietaryTagsUpdateComponent,
    resolve: {
      dietaryTags: DietaryTagsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(dietaryTagsRoute)],
  exports: [RouterModule],
})
export class DietaryTagsRoutingModule {}
