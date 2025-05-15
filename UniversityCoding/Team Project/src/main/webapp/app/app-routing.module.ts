import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          redirectTo: 'login',
          pathMatch: 'full',
        },
        {
          path: 'home',
          data: {
            authorities: [Authority.ADMIN, Authority.USER],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        },

        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: '',
          data: {
            authorities: [Authority.ADMIN, Authority.USER],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        {
          path: 'profile/:login',
          data: {
            authorities: [Authority.ADMIN, Authority.USER],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import(`./profile/profile.module`).then(m => m.ProfileModule),
        },
        {
          path: 'explore',
          data: {
            authorities: [Authority.ADMIN, Authority.USER],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import(`./explore/explore.module`).then(m => m.ExploreModule),
        },
        {
          path: 'view/:id',
          data: {
            authorities: [Authority.ADMIN, Authority.USER],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import(`./view/view.module`).then(m => m.ViewModule),
        },
        {
          path: 'settings',
          data: {
            authorities: [Authority.ADMIN, Authority.USER],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import(`./settings/settings.module`).then(m => m.SettingsModule),
        },
        {
          path: 'friend',
          data: {
            authorities: [Authority.ADMIN, Authority.USER],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import(`./friends/friends.module`).then(m => m.FriendsModule),
        },
        navbarRoute,
        ...errorRoute,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
