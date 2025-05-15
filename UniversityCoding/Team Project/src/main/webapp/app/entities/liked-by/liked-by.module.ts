import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LikedByComponent } from './list/liked-by.component';
import { LikedByDetailComponent } from './detail/liked-by-detail.component';
import { LikedByUpdateComponent } from './update/liked-by-update.component';
import { LikedByDeleteDialogComponent } from './delete/liked-by-delete-dialog.component';
import { LikedByRoutingModule } from './route/liked-by-routing.module';

@NgModule({
  imports: [SharedModule, LikedByRoutingModule],
  declarations: [LikedByComponent, LikedByDetailComponent, LikedByUpdateComponent, LikedByDeleteDialogComponent],
})
export class LikedByModule {}
