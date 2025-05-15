import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserPantryFormService, UserPantryFormGroup } from './user-pantry-form.service';
import { IUserPantry } from '../user-pantry.model';
import { UserPantryService } from '../service/user-pantry.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-user-pantry-update',
  templateUrl: './user-pantry-update.component.html',
})
export class UserPantryUpdateComponent implements OnInit {
  isSaving = false;
  userPantry: IUserPantry | null = null;

  postsSharedCollection: IPost[] = [];
  usersSharedCollection: IUser[] = [];

  editForm: UserPantryFormGroup = this.userPantryFormService.createUserPantryFormGroup();

  constructor(
    protected userPantryService: UserPantryService,
    protected userPantryFormService: UserPantryFormService,
    protected postService: PostService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePost = (o1: IPost | null, o2: IPost | null): boolean => this.postService.comparePost(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userPantry }) => {
      this.userPantry = userPantry;
      if (userPantry) {
        this.updateForm(userPantry);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userPantry = this.userPantryFormService.getUserPantry(this.editForm);
    if (userPantry.id !== null) {
      this.subscribeToSaveResponse(this.userPantryService.update(userPantry));
    } else {
      this.subscribeToSaveResponse(this.userPantryService.create(userPantry));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserPantry>>): void {
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

  protected updateForm(userPantry: IUserPantry): void {
    this.userPantry = userPantry;
    this.userPantryFormService.resetForm(this.editForm, userPantry);

    this.postsSharedCollection = this.postService.addPostToCollectionIfMissing<IPost>(this.postsSharedCollection, userPantry.post);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, userPantry.user);
  }

  protected loadRelationshipsOptions(): void {
    this.postService
      .query()
      .pipe(map((res: HttpResponse<IPost[]>) => res.body ?? []))
      .pipe(map((posts: IPost[]) => this.postService.addPostToCollectionIfMissing<IPost>(posts, this.userPantry?.post)))
      .subscribe((posts: IPost[]) => (this.postsSharedCollection = posts));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.userPantry?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
