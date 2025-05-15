import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LikedByFormService, LikedByFormGroup } from './liked-by-form.service';
import { ILikedBy } from '../liked-by.model';
import { LikedByService } from '../service/liked-by.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-liked-by-update',
  templateUrl: './liked-by-update.component.html',
})
export class LikedByUpdateComponent implements OnInit {
  isSaving = false;
  likedBy: ILikedBy | null = null;

  postsSharedCollection: IPost[] = [];
  usersSharedCollection: IUser[] = [];

  editForm: LikedByFormGroup = this.likedByFormService.createLikedByFormGroup();

  constructor(
    protected likedByService: LikedByService,
    protected likedByFormService: LikedByFormService,
    protected postService: PostService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePost = (o1: IPost | null, o2: IPost | null): boolean => this.postService.comparePost(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ likedBy }) => {
      this.likedBy = likedBy;
      if (likedBy) {
        this.updateForm(likedBy);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const likedBy = this.likedByFormService.getLikedBy(this.editForm);
    if (likedBy.id !== null) {
      this.subscribeToSaveResponse(this.likedByService.update(likedBy));
    } else {
      this.subscribeToSaveResponse(this.likedByService.create(likedBy));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILikedBy>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(likedBy: ILikedBy): void {
    this.likedBy = likedBy;
    this.likedByFormService.resetForm(this.editForm, likedBy);

    this.postsSharedCollection = this.postService.addPostToCollectionIfMissing<IPost>(this.postsSharedCollection, likedBy.post);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, likedBy.user);
  }

  protected loadRelationshipsOptions(): void {
    this.postService
      .query()
      .pipe(map((res: HttpResponse<IPost[]>) => res.body ?? []))
      .pipe(map((posts: IPost[]) => this.postService.addPostToCollectionIfMissing<IPost>(posts, this.likedBy?.post)))
      .subscribe((posts: IPost[]) => (this.postsSharedCollection = posts));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.likedBy?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
