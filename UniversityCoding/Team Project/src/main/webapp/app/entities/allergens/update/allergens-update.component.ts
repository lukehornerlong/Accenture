import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AllergensFormService, AllergensFormGroup } from './allergens-form.service';
import { IAllergens } from '../allergens.model';
import { AllergensService } from '../service/allergens.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

@Component({
  selector: 'jhi-allergens-update',
  templateUrl: './allergens-update.component.html',
})
export class AllergensUpdateComponent implements OnInit {
  isSaving = false;
  allergens: IAllergens | null = null;

  usersSharedCollection: IUser[] = [];
  postsSharedCollection: IPost[] = [];

  editForm: AllergensFormGroup = this.allergensFormService.createAllergensFormGroup();

  constructor(
    protected allergensService: AllergensService,
    protected allergensFormService: AllergensFormService,
    protected userService: UserService,
    protected postService: PostService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  comparePost = (o1: IPost | null, o2: IPost | null): boolean => this.postService.comparePost(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ allergens }) => {
      this.allergens = allergens;
      if (allergens) {
        this.updateForm(allergens);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const allergens = this.allergensFormService.getAllergens(this.editForm);
    if (allergens.id !== null) {
      this.subscribeToSaveResponse(this.allergensService.update(allergens));
    } else {
      this.subscribeToSaveResponse(this.allergensService.create(allergens));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAllergens>>): void {
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

  protected updateForm(allergens: IAllergens): void {
    this.allergens = allergens;
    this.allergensFormService.resetForm(this.editForm, allergens);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, allergens.user);
    this.postsSharedCollection = this.postService.addPostToCollectionIfMissing<IPost>(this.postsSharedCollection, allergens.post);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.allergens?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.postService
      .query()
      .pipe(map((res: HttpResponse<IPost[]>) => res.body ?? []))
      .pipe(map((posts: IPost[]) => this.postService.addPostToCollectionIfMissing<IPost>(posts, this.allergens?.post)))
      .subscribe((posts: IPost[]) => (this.postsSharedCollection = posts));
  }
}
