import { Component, OnInit } from '@angular/core';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';
import { UserPantryService } from 'app/entities/user-pantry/service/user-pantry.service';
import dayjs from 'dayjs/esm';
import { AccountService } from 'app/core/auth/account.service';
import { IUserPantry } from 'app/entities/user-pantry/user-pantry.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoComponent } from './info/info.component';

@Component({
  selector: 'jhi-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
  posts: IPost[] = [];
  currentUserID: any;
  userPantryPosts: IUserPantry[] = [];

  currentIndex = 0;

  likeDisabled = false;
  dislikeDisabled = false;

  likePost() {
    // increment current index if not disabled
    if (!this.likeDisabled) {
      this.currentIndex++;

      // if current index exceeds posts array length, disable like button
      if (this.currentIndex >= this.posts.length) {
        this.likeDisabled = true;
      }

      // save the current post to the user's pantry if it doesn't exist in the userPantryPosts array
      const currentPost = this.posts[this.currentIndex - 1];
      const postExistsInPantry = this.userPantryPosts.some(post => post.post?.id === currentPost.id);
      if (!postExistsInPantry) {
        this.userPantryService.addPostToPantry(dayjs(), currentPost, this.currentUserID).subscribe(() => {
          console.log('Post added to user pantry');
          // Add the post to userPantryPosts array to prevent duplicate addition
          this.userPantryPosts.push(currentPost);
        });
      }
    }
  }

  dislikePost() {
    // increment current index if not disabled
    if (!this.dislikeDisabled) {
      this.currentIndex++;

      // if current index exceeds posts array length, disable dislike button
      if (this.currentIndex >= this.posts.length) {
        this.dislikeDisabled = true;
      }
    }
  }

  openModal(post: any) {
    const modalRef = this.modalService.open(InfoComponent);
    modalRef.componentInstance.post = post;
  }

  constructor(
    private postService: PostService,
    private userPantryService: UserPantryService,
    private accountService: AccountService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.currentUserID = account;
      this.postService.query().subscribe(res => {
        this.posts = res.body ?? [];

        // disable like and dislike buttons if there are no posts
        if (this.posts.length === 0) {
          this.likeDisabled = true;
          this.dislikeDisabled = true;
        }
      });

      this.userPantryService.query().subscribe(req => {
        this.userPantryPosts = req.body?.filter(user => user.user?.id === this.currentUserID.id) ?? [];
      });
    });
  }
}
