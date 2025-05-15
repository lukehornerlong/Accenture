import { Route } from '@angular/router';

import { SettingsComponent } from './settings.component';

export const SETTINGS_ROUTE: Route = {
  path: '',
  component: SettingsComponent,
  data: {
    pageTitle: 'settings.title',
  },
};
