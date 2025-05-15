import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { EXPLORE_ROUTE } from './explore.route';
import { InfoComponent } from './info/info.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([EXPLORE_ROUTE])],
  declarations: [InfoComponent],
})
export class ExploreModule {}
