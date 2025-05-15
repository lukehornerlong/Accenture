import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPost } from '../post.model';
import { PostService } from '../service/post.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { UserPantryService } from 'app/entities/user-pantry/service/user-pantry.service';
import { IUserPantry } from 'app/entities/user-pantry/user-pantry.model';
import { HttpResponse } from '@angular/common/http';
import { LikedByService } from 'app/entities/liked-by/service/liked-by.service';
import { ILikedBy } from 'app/entities/liked-by/liked-by.model';

@Component({
  templateUrl: './post-delete-dialog.component.html',
})
export class PostDeleteDialogComponent {
  post?: IPost;

  constructor(
    protected postService: PostService,
    protected activeModal: NgbActiveModal,
    private userPantryService: UserPantryService,
    private likedByService: LikedByService
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(postId: number): void {
    // First, fetch all associated userPantry objects with matching postId
    this.userPantryService.query({ 'postId.equals': postId, 'id.notEquals': null }).subscribe(
      (res: HttpResponse<IUserPantry[]>) => {
        const userPantries: IUserPantry[] = res.body!;
        // Delete all associated userPantry objects first
        userPantries.forEach(userPantry => {
          if (userPantry.post?.id === postId) {
            this.userPantryService.delete(userPantry.id!).subscribe(
              () => {}, // Do nothing on success
              error => console.error('Failed to delete userPantry with ID ' + userPantry.id, error)
            );
          }
        });

        // Fetch all associated likedBy objects with matching postId
        this.likedByService.query({ 'postId.equals': postId, 'id.notEquals': null }).subscribe(
          (res: HttpResponse<ILikedBy[]>) => {
            const likedByObjects: ILikedBy[] = res.body!;
            // Delete all associated likedBy objects
            likedByObjects.forEach(likedByObject => {
              this.likedByService.delete(likedByObject.id!).subscribe(
                () => {}, // Do nothing on success
                error => console.error('Failed to delete likedBy object with ID ' + likedByObject.id, error)
              );
            });

            // Then delete the post object
            this.postService.delete(postId).subscribe(
              () => {
                location.reload();
              }, // Do nothing on success
              error => console.error('Failed to delete post with ID ' + postId, error)
            );
          },
          error => {
            console.error('Failed to fetch associated likedBy objects', error);
          }
        );
      },
      error => {
        console.error('Failed to fetch associated userPantry objects', error);
      }
    );
  }
}
