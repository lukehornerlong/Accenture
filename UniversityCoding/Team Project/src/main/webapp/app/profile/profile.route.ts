import { Route } from '@angular/router';

import { ProfileComponent } from './profile.component';

export const PROFILE_ROUTE: Route = {
  path: '',
  component: ProfileComponent,
  data: {
    pageTitle: 'profile.title',
  },
};
