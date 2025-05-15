import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { PROFILE_ROUTE } from './profile.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([PROFILE_ROUTE])],
})
export class ProfileModule {}
