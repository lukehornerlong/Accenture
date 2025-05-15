import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserPantryComponent } from './list/user-pantry.component';
import { UserPantryDetailComponent } from './detail/user-pantry-detail.component';
import { UserPantryUpdateComponent } from './update/user-pantry-update.component';
import { UserPantryDeleteDialogComponent } from './delete/user-pantry-delete-dialog.component';
import { UserPantryRoutingModule } from './route/user-pantry-routing.module';

@NgModule({
  imports: [SharedModule, UserPantryRoutingModule],
  declarations: [UserPantryComponent, UserPantryDetailComponent, UserPantryUpdateComponent, UserPantryDeleteDialogComponent],
})
export class UserPantryModule {}
