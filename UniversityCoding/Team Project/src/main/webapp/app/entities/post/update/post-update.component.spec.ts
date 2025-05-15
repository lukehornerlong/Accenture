import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PostFormService } from './post-form.service';
import { PostService } from '../service/post.service';
import { IPost } from '../post.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IDietaryTags } from 'app/entities/dietary-tags/dietary-tags.model';
import { DietaryTagsService } from 'app/entities/dietary-tags/service/dietary-tags.service';

import { PostUpdateComponent } from './post-update.component';

describe('Post Management Update Component', () => {
  let comp: PostUpdateComponent;
  let fixture: ComponentFixture<PostUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let postFormService: PostFormService;
  let postService: PostService;
  let userService: UserService;
  let dietaryTagsService: DietaryTagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PostUpdateComponent],
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
      .overrideTemplate(PostUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PostUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    postFormService = TestBed.inject(PostFormService);
    postService = TestBed.inject(PostService);
    userService = TestBed.inject(UserService);
    dietaryTagsService = TestBed.inject(DietaryTagsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const post: IPost = { id: 456 };
      const user: IUser = { id: 83665 };
      post.user = user;

      const userCollection: IUser[] = [{ id: 79363 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ post });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call DietaryTags query and add missing value', () => {
      const post: IPost = { id: 456 };
      const dietaryTags: IDietaryTags[] = [{ id: 25216 }];
      post.dietaryTags = dietaryTags;

      const dietaryTagsCollection: IDietaryTags[] = [{ id: 85120 }];
      jest.spyOn(dietaryTagsService, 'query').mockReturnValue(of(new HttpResponse({ body: dietaryTagsCollection })));
      const additionalDietaryTags = [...dietaryTags];
      const expectedCollection: IDietaryTags[] = [...additionalDietaryTags, ...dietaryTagsCollection];
      jest.spyOn(dietaryTagsService, 'addDietaryTagsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ post });
      comp.ngOnInit();

      expect(dietaryTagsService.query).toHaveBeenCalled();
      expect(dietaryTagsService.addDietaryTagsToCollectionIfMissing).toHaveBeenCalledWith(
        dietaryTagsCollection,
        ...additionalDietaryTags.map(expect.objectContaining)
      );
      expect(comp.dietaryTagsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const post: IPost = { id: 456 };
      const user: IUser = { id: 98794 };
      post.user = user;
      const dietaryTags: IDietaryTags = { id: 65026 };
      post.dietaryTags = [dietaryTags];

      activatedRoute.data = of({ post });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.dietaryTagsSharedCollection).toContain(dietaryTags);
      expect(comp.post).toEqual(post);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPost>>();
      const post = { id: 123 };
      jest.spyOn(postFormService, 'getPost').mockReturnValue(post);
      jest.spyOn(postService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ post });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: post }));
      saveSubject.complete();

      // THEN
      expect(postFormService.getPost).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(postService.update).toHaveBeenCalledWith(expect.objectContaining(post));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPost>>();
      const post = { id: 123 };
      jest.spyOn(postFormService, 'getPost').mockReturnValue({ id: null });
      jest.spyOn(postService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ post: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: post }));
      saveSubject.complete();

      // THEN
      expect(postFormService.getPost).toHaveBeenCalled();
      expect(postService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPost>>();
      const post = { id: 123 };
      jest.spyOn(postService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ post });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(postService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareDietaryTags', () => {
      it('Should forward to dietaryTagsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(dietaryTagsService, 'compareDietaryTags');
        comp.compareDietaryTags(entity, entity2);
        expect(dietaryTagsService.compareDietaryTags).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
