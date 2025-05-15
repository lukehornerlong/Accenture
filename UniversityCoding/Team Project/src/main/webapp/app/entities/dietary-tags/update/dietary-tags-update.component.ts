import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DietaryTagsFormService, DietaryTagsFormGroup } from './dietary-tags-form.service';
import { IDietaryTags } from '../dietary-tags.model';
import { DietaryTagsService } from '../service/dietary-tags.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

@Component({
  selector: 'jhi-dietary-tags-update',
  templateUrl: './dietary-tags-update.component.html',
})
export class DietaryTagsUpdateComponent implements OnInit {
  isSaving = false;
  dietaryTags: IDietaryTags | null = null;

  postsSharedCollection: IPost[] = [];

  editForm: DietaryTagsFormGroup = this.dietaryTagsFormService.createDietaryTagsFormGroup();

  constructor(
    protected dietaryTagsService: DietaryTagsService,
    protected dietaryTagsFormService: DietaryTagsFormService,
    protected postService: PostService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePost = (o1: IPost | null, o2: IPost | null): boolean => this.postService.comparePost(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dietaryTags }) => {
      this.dietaryTags = dietaryTags;
      if (dietaryTags) {
        this.updateForm(dietaryTags);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const dietaryTags = this.dietaryTagsFormService.getDietaryTags(this.editForm);
    if (dietaryTags.id !== null) {
      this.subscribeToSaveResponse(this.dietaryTagsService.update(dietaryTags));
    } else {
      this.subscribeToSaveResponse(this.dietaryTagsService.create(dietaryTags));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDietaryTags>>): void {
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

  protected updateForm(dietaryTags: IDietaryTags): void {
    this.dietaryTags = dietaryTags;
    this.dietaryTagsFormService.resetForm(this.editForm, dietaryTags);

    this.postsSharedCollection = this.postService.addPostToCollectionIfMissing<IPost>(
      this.postsSharedCollection,
      ...(dietaryTags.posts ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.postService
      .query()
      .pipe(map((res: HttpResponse<IPost[]>) => res.body ?? []))
      .pipe(map((posts: IPost[]) => this.postService.addPostToCollectionIfMissing<IPost>(posts, ...(this.dietaryTags?.posts ?? []))))
      .subscribe((posts: IPost[]) => (this.postsSharedCollection = posts));
  }
}
