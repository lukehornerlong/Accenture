import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PostFormService, PostFormGroup } from './post-form.service';
import { IPost } from '../post.model';
import { PostService } from '../service/post.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IDietaryTags } from 'app/entities/dietary-tags/dietary-tags.model';
import { DietaryTagsService } from 'app/entities/dietary-tags/service/dietary-tags.service';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-post-update',
  templateUrl: './post-update.component.html',
})
export class PostUpdateComponent implements OnInit {
  isSaving = false;
  post: IPost | null = null;
  currentUserID: any;

  usersSharedCollection: IUser[] = [];
  dietaryTagsSharedCollection: IDietaryTags[] = [];

  editForm: PostFormGroup = this.postFormService.createPostFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected postService: PostService,
    protected postFormService: PostFormService,
    protected userService: UserService,
    protected dietaryTagsService: DietaryTagsService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private accountService: AccountService
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareDietaryTags = (o1: IDietaryTags | null, o2: IDietaryTags | null): boolean => this.dietaryTagsService.compareDietaryTags(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ post }) => {
      this.post = post;
      if (post) {
        this.updateForm(post);
      }

      this.loadRelationshipsOptions();
    });

    this.accountService.identity().subscribe(account => {
      const isAuthenticated = this.accountService.isAuthenticated();
      if (isAuthenticated) {
        this.currentUserID = account;
      }
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const post = this.postFormService.getPost(this.editForm);
    if (post.id !== null) {
      this.subscribeToSaveResponse(this.postService.update(post));
    } else {
      this.subscribeToSaveResponse(this.postService.create(post));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPost>>): void {
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

  protected updateForm(post: IPost): void {
    this.post = post;
    this.postFormService.resetForm(this.editForm, post);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, post.user);
    this.dietaryTagsSharedCollection = this.dietaryTagsService.addDietaryTagsToCollectionIfMissing<IDietaryTags>(
      this.dietaryTagsSharedCollection,
      ...(post.dietaryTags ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.post?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.dietaryTagsService
      .query()
      .pipe(map((res: HttpResponse<IDietaryTags[]>) => res.body ?? []))
      .pipe(
        map((dietaryTags: IDietaryTags[]) =>
          this.dietaryTagsService.addDietaryTagsToCollectionIfMissing<IDietaryTags>(dietaryTags, ...(this.post?.dietaryTags ?? []))
        )
      )
      .subscribe((dietaryTags: IDietaryTags[]) => (this.dietaryTagsSharedCollection = dietaryTags));
  }
}
