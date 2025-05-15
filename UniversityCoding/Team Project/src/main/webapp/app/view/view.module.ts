import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { VIEW_ROUTE } from './view.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([VIEW_ROUTE])],
})
export class ViewModule {}
