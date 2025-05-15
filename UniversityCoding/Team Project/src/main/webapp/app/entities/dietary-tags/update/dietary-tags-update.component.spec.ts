import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DietaryTagsFormService } from './dietary-tags-form.service';
import { DietaryTagsService } from '../service/dietary-tags.service';
import { IDietaryTags } from '../dietary-tags.model';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

import { DietaryTagsUpdateComponent } from './dietary-tags-update.component';

describe('DietaryTags Management Update Component', () => {
  let comp: DietaryTagsUpdateComponent;
  let fixture: ComponentFixture<DietaryTagsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let dietaryTagsFormService: DietaryTagsFormService;
  let dietaryTagsService: DietaryTagsService;
  let postService: PostService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DietaryTagsUpdateComponent],
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
      .overrideTemplate(DietaryTagsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DietaryTagsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    dietaryTagsFormService = TestBed.inject(DietaryTagsFormService);
    dietaryTagsService = TestBed.inject(DietaryTagsService);
    postService = TestBed.inject(PostService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Post query and add missing value', () => {
      const dietaryTags: IDietaryTags = { id: 456 };
      const posts: IPost[] = [{ id: 82469 }];
      dietaryTags.posts = posts;

      const postCollection: IPost[] = [{ id: 33849 }];
      jest.spyOn(postService, 'query').mockReturnValue(of(new HttpResponse({ body: postCollection })));
      const additionalPosts = [...posts];
      const expectedCollection: IPost[] = [...additionalPosts, ...postCollection];
      jest.spyOn(postService, 'addPostToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ dietaryTags });
      comp.ngOnInit();

      expect(postService.query).toHaveBeenCalled();
      expect(postService.addPostToCollectionIfMissing).toHaveBeenCalledWith(
        postCollection,
        ...additionalPosts.map(expect.objectContaining)
      );
      expect(comp.postsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const dietaryTags: IDietaryTags = { id: 456 };
      const post: IPost = { id: 50832 };
      dietaryTags.posts = [post];

      activatedRoute.data = of({ dietaryTags });
      comp.ngOnInit();

      expect(comp.postsSharedCollection).toContain(post);
      expect(comp.dietaryTags).toEqual(dietaryTags);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDietaryTags>>();
      const dietaryTags = { id: 123 };
      jest.spyOn(dietaryTagsFormService, 'getDietaryTags').mockReturnValue(dietaryTags);
      jest.spyOn(dietaryTagsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dietaryTags });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dietaryTags }));
      saveSubject.complete();

      // THEN
      expect(dietaryTagsFormService.getDietaryTags).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(dietaryTagsService.update).toHaveBeenCalledWith(expect.objectContaining(dietaryTags));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDietaryTags>>();
      const dietaryTags = { id: 123 };
      jest.spyOn(dietaryTagsFormService, 'getDietaryTags').mockReturnValue({ id: null });
      jest.spyOn(dietaryTagsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dietaryTags: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dietaryTags }));
      saveSubject.complete();

      // THEN
      expect(dietaryTagsFormService.getDietaryTags).toHaveBeenCalled();
      expect(dietaryTagsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDietaryTags>>();
      const dietaryTags = { id: 123 };
      jest.spyOn(dietaryTagsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dietaryTags });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(dietaryTagsService.update).toHaveBeenCalled();
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
