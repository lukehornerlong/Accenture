import { Route } from '@angular/router';

import { ExploreComponent } from './explore.component';

export const EXPLORE_ROUTE: Route = {
  path: '',
  component: ExploreComponent,
  data: {
    pageTitle: 'explore.title',
  },
};
