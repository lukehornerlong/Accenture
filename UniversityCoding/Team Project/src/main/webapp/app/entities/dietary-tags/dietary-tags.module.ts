import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DietaryTagsComponent } from './list/dietary-tags.component';
import { DietaryTagsDetailComponent } from './detail/dietary-tags-detail.component';
import { DietaryTagsUpdateComponent } from './update/dietary-tags-update.component';
import { DietaryTagsDeleteDialogComponent } from './delete/dietary-tags-delete-dialog.component';
import { DietaryTagsRoutingModule } from './route/dietary-tags-routing.module';

@NgModule({
  imports: [SharedModule, DietaryTagsRoutingModule],
  declarations: [DietaryTagsComponent, DietaryTagsDetailComponent, DietaryTagsUpdateComponent, DietaryTagsDeleteDialogComponent],
})
export class DietaryTagsModule {}
