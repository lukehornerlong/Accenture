import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILikedBy } from '../liked-by.model';
import { LikedByService } from '../service/liked-by.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './liked-by-delete-dialog.component.html',
})
export class LikedByDeleteDialogComponent {
  likedBy?: ILikedBy;

  constructor(protected likedByService: LikedByService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.likedByService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
