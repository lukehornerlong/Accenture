import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { UserExtraService } from 'app/entities/user-extra/service/user-extra.service';
import { IUserExtra } from 'app/entities/user-extra/user-extra.model';
import { PostService } from 'app/entities/post/service/post.service';
import { ILikedBy } from 'app/entities/liked-by/liked-by.model';
import { LikedByService } from 'app/entities/liked-by/service/liked-by.service';
import { Router } from '@angular/router';
import { UserPantryService } from 'app/entities/user-pantry/service/user-pantry.service';
import { IUserPantry } from 'app/entities/user-pantry/user-pantry.model';
import { IPost } from 'app/entities/post/post.model';
import { CommentService } from 'app/entities/comment/service/comment.service';
import { IComment } from '../entities/comment/comment.model';
import { Account } from '../core/auth/account.model';
import { CommentFormService } from 'app/entities/comment/update/comment-form.service';
import { IUser } from '../entities/user/user.model';
import { map } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { divide } from 'cypress/types/lodash';

@Component({
  selector: 'jhi-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private userExtraService: UserExtraService,
    private accountService: AccountService,
    private postService: PostService,
    private likedByService: LikedByService,
    private router: Router,

    private userPantryService: UserPantryService,

    private commentService: CommentService,

    private fb: FormBuilder
  ) {}
  post: any;
  userExtra: IUserExtra[] = [];
  currentUserID: any;
  postUserExtra: IUserExtra[] = [];
  liked: ILikedBy[] = [];
  userPantry: IUserPantry[] = [];
  userPantryId: IUserPantry[] = [];
  allUserExtra: IUserExtra[] = [];

  postId!: number;
  comments: IComment[] = [];
  commentsTwo: IComment[] = [];
  commentText: string = '';
  commentRating: number = 0;
  ratingTotal: number = 0;
  ratingAverage: number = 0;
  roundedRatingAverage: number = 0;
  totalComments: number = 0;
  commented: boolean = false;

  loadAllComments(): void {
    this.commentService.query().subscribe(req => {
      this.comments = req.body?.filter(comment => comment.post?.id === this.post.id) ?? [];
      this.totalComments = this.comments.length;
      let i = 0;

      while (i < this.comments.length) {
        this.ratingTotal += this.comments[i].rating!;
        if (this.comments[i].user!.id == this.currentUserID.id) {
          this.commented = true;
        }
        i++;
      }
      this.ratingAverage = this.ratingTotal / this.totalComments;
      this.roundedRatingAverage = Math.floor(this.ratingAverage);
    });
  }
  deleteComment(): void {
    let i = 0;
    while (i < this.comments.length) {
      if (this.comments[i].user!.id == this.currentUserID.id) {
        this.commentService.delete(this.comments[i].id).subscribe(
          () => {}, // Do nothing on success
          error => console.error('Failed to delete post with ID ' + this.currentUserID, error)
        );
      }
      i++;
    }
  }

  onSubmit(): void {
    if (this.post.user.login === this.currentUserID.login) {
      alert('You cannot comment on your own post');
      return;
    }
    if (this.commented) {
      alert('You cannot comment on this post again');
      return;
    }
    this.commentService.addCommentToComments(this.commentText, this.commentRating, this.post, this.currentUserID).subscribe(() => {
      console.log('Comment added to user post');
    });
  }
  onStar1(): void {
    this.commentRating = 1;
    var elem = document.getElementById('star1')!;
    elem.className = 'checkedRating';
    var elem = document.getElementById('star2')!;
    elem.className = 'ratingStar';
    var elem = document.getElementById('star3')!;
    elem.className = 'ratingStar';
    var elem = document.getElementById('star4')!;
    elem.className = 'ratingStar';
    var elem = document.getElementById('star5')!;
    elem.className = 'ratingStar';
  }
  onStar2(): void {
    this.commentRating = 2;
    var elem = document.getElementById('star1')!;
    elem.className = 'checkedRating';
    var elem = document.getElementById('star2')!;
    elem.className = 'checkedRating';
    var elem = document.getElementById('star3')!;
    elem.className = 'ratingStar';
    var elem = document.getElementById('star4')!;
    elem.className = 'ratingStar';
    var elem = document.getElementById('star5')!;
    elem.className = 'ratingStar';
  }
  onStar3(): void {
    this.commentRating = 3;
    var elem = document.getElementById('star1')!;
    elem.className = 'checkedRating';
    var elem = document.getElementById('star2')!;
    elem.className = 'checkedRating';
    var elem = document.getElementById('star3')!;
    elem.className = 'checkedRating';
    var elem = document.getElementById('star4')!;
    elem.className = 'ratingStar';
    var elem = document.getElementById('star5')!;
    elem.className = 'ratingStar';
  }
  onStar4(): void {
    this.commentRating = 4;
    var elem = document.getElementById('star1')!;
    elem.className = 'checkedRating';
    var elem = document.getElementById('star2')!;
    elem.className = 'checkedRating';
    var elem = document.getElementById('star3')!;
    elem.className = 'checkedRating';
    var elem = document.getElementById('star4')!;
    elem.className = 'checkedRating';
    var elem = document.getElementById('star5')!;
    elem.className = 'ratingStar';
  }
  onStar5(): void {
    this.commentRating = 5;
    var elem = document.getElementById('star1')!;
    elem.className = 'checkedRating';
    var elem = document.getElementById('star2')!;
    elem.className = 'checkedRating';
    var elem = document.getElementById('star3')!;
    elem.className = 'checkedRating';
    var elem = document.getElementById('star4')!;
    elem.className = 'checkedRating';
    var elem = document.getElementById('star5')!;
    elem.className = 'checkedRating';
  }
  clearStars(): void {
    this.commentRating = 0;
    var elem = document.getElementById('star1')!;
    elem.className = 'ratingStar';
    var elem = document.getElementById('star2')!;
    elem.className = 'ratingStar';
    var elem = document.getElementById('star3')!;
    elem.className = 'ratingStar';
    var elem = document.getElementById('star4')!;
    elem.className = 'ratingStar';
    var elem = document.getElementById('star5')!;
    elem.className = 'ratingStar';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const postId = params.get('id') ?? '';
      this.http.get(`api/posts/${postId}`).subscribe((res: any) => {
        this.post = res;
        this.getPostUserPP();
      });

      const postIdNumber = parseInt(postId, 10);
      if (isNaN(postIdNumber)) {
        this.router.navigate(['/404']);
      } else {
        this.postService.find(postIdNumber).subscribe(
          (res: any) => {
            if (res.body === null) {
              this.router.navigate(['/404']);
            } else {
              this.post = res.body;
            }
          },
          error => {
            this.router.navigate(['/404']);
          }
        );
      }

      this.accountService.identity().subscribe(account => {
        this.currentUserID = account;
        console.log(this.currentUserID);
        this.userExtraService.query().subscribe(req => {
          this.userExtra = req.body?.filter(user => user.user?.id === this.currentUserID.id) ?? [];
        });

        this.likedByService.query().subscribe(req => {
          this.liked = req.body?.filter(like => like.user?.id === this.currentUserID.id) ?? [];
        });
      });

      this.userPantryService.query().subscribe(req => {
        this.userPantry = req.body?.filter(pantry => pantry.user?.id === this.currentUserID.id) ?? [];
        this.userPantryId = req.body?.filter(pantry => pantry.post?.id === this.post.id && pantry.user?.id === this.currentUserID.id) ?? [];
        console.log('ID' + this.userPantryId);
      });

      this.getUserPantryId();

      this.loadAllComments();
    });
  }

  getPostUserPP() {
    this.userExtraService.query().subscribe(req => {
      this.postUserExtra = req.body?.filter(user => user.user?.id === this.post.user.id) ?? [];
      this.allUserExtra = req.body ?? [];
    });
  }

  getUserPantryId() {
    this.userPantryService.query().subscribe(req => {
      this.userPantryId = req.body?.filter(pantry => pantry.post?.id === this.post.id && pantry.user?.id === this.currentUserID.id) ?? [];
      console.log('ID' + this.userPantryId);
    });
  }

  onLike() {
    if (this.post.user.login === this.currentUserID.login) {
      alert('You cannot like your own post');
      return;
    }

    const hasLiked = this.liked.some(like => like.post?.id === this.post.id && like.liked); // check if user has already liked the post
    if (!hasLiked) {
      this.post.likes += 1; // increment likes count
      this.postService.updatePost(this.post).subscribe(() => {
        console.log('Post updated successfully');
      });
      this.likedByService.addPostToLikedBy(this.post, this.currentUserID, true).subscribe(() => {
        console.log('Like created successfully');
        const newLike: ILikedBy = {
          id: 0,
          post: this.post,
          user: this.currentUserID,
          liked: true, // set hasLiked field to true
        };

        this.liked.push(newLike);
        console.log('Liked array: ' + this.liked);
      });
    } else {
      console.log('You have already liked this post');
    }
  }

  onDeletePost() {
    const confirmed = confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      // First, fetch all associated userPantry objects with matching postId
      this.userPantryService.query({ 'postId.equals': this.post.id, 'id.notEquals': null }).subscribe(
        (res: HttpResponse<IUserPantry[]>) => {
          const userPantries: IUserPantry[] = res.body!;
          // Delete all associated userPantry objects first
          userPantries.forEach(userPantry => {
            if (userPantry.post?.id === this.post.id) {
              this.userPantryService.delete(userPantry.id!).subscribe(
                () => {}, // Do nothing on success
                error => console.error('Failed to delete userPantry with ID ' + userPantry.id, error)
              );
            }
          });

          // Fetch all associated likedBy objects with matching postId
          this.likedByService.query({ 'postId.equals': this.post.id, 'id.notEquals': null }).subscribe(
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
              this.postService.delete(this.post.id).subscribe(
                () => {
                  this.router.navigate(['/']);
                }, // Do nothing on success
                error => console.error('Failed to delete post with ID ' + this.post.id, error)
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
    } else {
      alert('Post not deleted');
    }
  }

  onDeletePantryPost() {
    const confirmed = confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      this.userPantryService.delete(this.userPantryId[0].id).subscribe(() => {
        console.log('Post deleted successfully');
        this.router.navigate(['/']);
        alert('Post deleted');
      });
    }
  }

  isInPantry(): boolean {
    return this.userPantry.some(p => p.post?.id === this.post.id);
  }
}
