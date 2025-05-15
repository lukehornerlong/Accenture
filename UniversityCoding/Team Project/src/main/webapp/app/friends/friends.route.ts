import { Route } from '@angular/router';

import { FriendsComponent } from './friends.component';

export const FRIENDS_ROUTE: Route = {
  path: '',
  component: FriendsComponent,
  data: {
    pageTitle: 'explore.title',
  },
};
