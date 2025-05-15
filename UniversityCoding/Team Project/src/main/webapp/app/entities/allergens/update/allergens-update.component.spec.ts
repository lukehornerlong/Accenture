import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AllergensFormService } from './allergens-form.service';
import { AllergensService } from '../service/allergens.service';
import { IAllergens } from '../allergens.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

import { AllergensUpdateComponent } from './allergens-update.component';

describe('Allergens Management Update Component', () => {
  let comp: AllergensUpdateComponent;
  let fixture: ComponentFixture<AllergensUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let allergensFormService: AllergensFormService;
  let allergensService: AllergensService;
  let userService: UserService;
  let postService: PostService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AllergensUpdateComponent],
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
      .overrideTemplate(AllergensUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AllergensUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    allergensFormService = TestBed.inject(AllergensFormService);
    allergensService = TestBed.inject(AllergensService);
    userService = TestBed.inject(UserService);
    postService = TestBed.inject(PostService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const allergens: IAllergens = { id: 456 };
      const user: IUser = { id: 74815 };
      allergens.user = user;

      const userCollection: IUser[] = [{ id: 47933 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ allergens });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Post query and add missing value', () => {
      const allergens: IAllergens = { id: 456 };
      const post: IPost = { id: 81956 };
      allergens.post = post;

      const postCollection: IPost[] = [{ id: 16614 }];
      jest.spyOn(postService, 'query').mockReturnValue(of(new HttpResponse({ body: postCollection })));
      const additionalPosts = [post];
      const expectedCollection: IPost[] = [...additionalPosts, ...postCollection];
      jest.spyOn(postService, 'addPostToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ allergens });
      comp.ngOnInit();

      expect(postService.query).toHaveBeenCalled();
      expect(postService.addPostToCollectionIfMissing).toHaveBeenCalledWith(
        postCollection,
        ...additionalPosts.map(expect.objectContaining)
      );
      expect(comp.postsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const allergens: IAllergens = { id: 456 };
      const user: IUser = { id: 88814 };
      allergens.user = user;
      const post: IPost = { id: 58139 };
      allergens.post = post;

      activatedRoute.data = of({ allergens });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.postsSharedCollection).toContain(post);
      expect(comp.allergens).toEqual(allergens);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAllergens>>();
      const allergens = { id: 123 };
      jest.spyOn(allergensFormService, 'getAllergens').mockReturnValue(allergens);
      jest.spyOn(allergensService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ allergens });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: allergens }));
      saveSubject.complete();

      // THEN
      expect(allergensFormService.getAllergens).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(allergensService.update).toHaveBeenCalledWith(expect.objectContaining(allergens));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAllergens>>();
      const allergens = { id: 123 };
      jest.spyOn(allergensFormService, 'getAllergens').mockReturnValue({ id: null });
      jest.spyOn(allergensService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ allergens: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: allergens }));
      saveSubject.complete();

      // THEN
      expect(allergensFormService.getAllergens).toHaveBeenCalled();
      expect(allergensService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAllergens>>();
      const allergens = { id: 123 };
      jest.spyOn(allergensService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ allergens });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(allergensService.update).toHaveBeenCalled();
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
