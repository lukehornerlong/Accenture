import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDietaryTags } from '../dietary-tags.model';
import { DietaryTagsService } from '../service/dietary-tags.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './dietary-tags-delete-dialog.component.html',
})
export class DietaryTagsDeleteDialogComponent {
  dietaryTags?: IDietaryTags;

  constructor(protected dietaryTagsService: DietaryTagsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.dietaryTagsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
