import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IngredientFormService } from './ingredient-form.service';
import { IngredientService } from '../service/ingredient.service';
import { IIngredient } from '../ingredient.model';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

import { IngredientUpdateComponent } from './ingredient-update.component';

describe('Ingredient Management Update Component', () => {
  let comp: IngredientUpdateComponent;
  let fixture: ComponentFixture<IngredientUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ingredientFormService: IngredientFormService;
  let ingredientService: IngredientService;
  let postService: PostService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [IngredientUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(IngredientUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IngredientUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ingredientFormService = TestBed.inject(IngredientFormService);
    ingredientService = TestBed.inject(IngredientService);
    postService = TestBed.inject(PostService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Post query and add missing value', () => {
      const ingredient: IIngredient = { id: 456 };
      const post: IPost = { id: 87120 };
      ingredient.post = post;

      const postCollection: IPost[] = [{ id: 44123 }];
      jest.spyOn(postService, 'query').mockReturnValue(of(new HttpResponse({ body: postCollection })));
      const additionalPosts = [post];
      const expectedCollection: IPost[] = [...additionalPosts, ...postCollection];
      jest.spyOn(postService, 'addPostToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ingredient });
      comp.ngOnInit();

      expect(postService.query).toHaveBeenCalled();
      expect(postService.addPostToCollectionIfMissing).toHaveBeenCalledWith(
        postCollection,
        ...additionalPosts.map(expect.objectContaining)
      );
      expect(comp.postsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ingredient: IIngredient = { id: 456 };
      const post: IPost = { id: 54408 };
      ingredient.post = post;

      activatedRoute.data = of({ ingredient });
      comp.ngOnInit();

      expect(comp.postsSharedCollection).toContain(post);
      expect(comp.ingredient).toEqual(ingredient);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIngredient>>();
      const ingredient = { id: 123 };
      jest.spyOn(ingredientFormService, 'getIngredient').mockReturnValue(ingredient);
      jest.spyOn(ingredientService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ingredient });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ingredient }));
      saveSubject.complete();

      // THEN
      expect(ingredientFormService.getIngredient).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ingredientService.update).toHaveBeenCalledWith(expect.objectContaining(ingredient));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIngredient>>();
      const ingredient = { id: 123 };
      jest.spyOn(ingredientFormService, 'getIngredient').mockReturnValue({ id: null });
      jest.spyOn(ingredientService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ingredient: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ingredient }));
      saveSubject.complete();

      // THEN
      expect(ingredientFormService.getIngredient).toHaveBeenCalled();
      expect(ingredientService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIngredient>>();
      const ingredient = { id: 123 };
      jest.spyOn(ingredientService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ingredient });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ingredientService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePost', () => {
      it('Should forward to postService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(postService, 'comparePost');
        comp.comparePost(entity, entity2);
        expect(postService.comparePost).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
