import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { FRIENDS_ROUTE } from './friends.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([FRIENDS_ROUTE])],
})
export class FriendsModule {}
