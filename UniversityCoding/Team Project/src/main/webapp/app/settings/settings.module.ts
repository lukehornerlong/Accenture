import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { SETTINGS_ROUTE } from './settings.route';

@NgModule({
  declarations: [],
  imports: [SharedModule, RouterModule.forChild([SETTINGS_ROUTE])],
})
export class SettingsModule {}
