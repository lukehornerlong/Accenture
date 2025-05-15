import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IngredientFormService, IngredientFormGroup } from './ingredient-form.service';
import { IIngredient } from '../ingredient.model';
import { IngredientService } from '../service/ingredient.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

@Component({
  selector: 'jhi-ingredient-update',
  templateUrl: './ingredient-update.component.html',
})
export class IngredientUpdateComponent implements OnInit {
  isSaving = false;
  ingredient: IIngredient | null = null;

  postsSharedCollection: IPost[] = [];

  editForm: IngredientFormGroup = this.ingredientFormService.createIngredientFormGroup();

  constructor(
    protected ingredientService: IngredientService,
    protected ingredientFormService: IngredientFormService,
    protected postService: PostService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePost = (o1: IPost | null, o2: IPost | null): boolean => this.postService.comparePost(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ingredient }) => {
      this.ingredient = ingredient;
      if (ingredient) {
        this.updateForm(ingredient);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ingredient = this.ingredientFormService.getIngredient(this.editForm);
    if (ingredient.id !== null) {
      this.subscribeToSaveResponse(this.ingredientService.update(ingredient));
    } else {
      this.subscribeToSaveResponse(this.ingredientService.create(ingredient));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIngredient>>): void {
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

  protected updateForm(ingredient: IIngredient): void {
    this.ingredient = ingredient;
    this.ingredientFormService.resetForm(this.editForm, ingredient);

    this.postsSharedCollection = this.postService.addPostToCollectionIfMissing<IPost>(this.postsSharedCollection, ingredient.post);
  }

  protected loadRelationshipsOptions(): void {
    this.postService
      .query()
      .pipe(map((res: HttpResponse<IPost[]>) => res.body ?? []))
      .pipe(map((posts: IPost[]) => this.postService.addPostToCollectionIfMissing<IPost>(posts, this.ingredient?.post)))
      .subscribe((posts: IPost[]) => (this.postsSharedCollection = posts));
  }
}
