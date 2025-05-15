import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserPantry } from '../user-pantry.model';
import { UserPantryService } from '../service/user-pantry.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './user-pantry-delete-dialog.component.html',
})
export class UserPantryDeleteDialogComponent {
  userPantry?: IUserPantry;

  constructor(protected userPantryService: UserPantryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userPantryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
