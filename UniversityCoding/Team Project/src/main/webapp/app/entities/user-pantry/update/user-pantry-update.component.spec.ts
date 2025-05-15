import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserPantryFormService } from './user-pantry-form.service';
import { UserPantryService } from '../service/user-pantry.service';
import { IUserPantry } from '../user-pantry.model';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { UserPantryUpdateComponent } from './user-pantry-update.component';

describe('UserPantry Management Update Component', () => {
  let comp: UserPantryUpdateComponent;
  let fixture: ComponentFixture<UserPantryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userPantryFormService: UserPantryFormService;
  let userPantryService: UserPantryService;
  let postService: PostService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserPantryUpdateComponent],
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
      .overrideTemplate(UserPantryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserPantryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userPantryFormService = TestBed.inject(UserPantryFormService);
    userPantryService = TestBed.inject(UserPantryService);
    postService = TestBed.inject(PostService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Post query and add missing value', () => {
      const userPantry: IUserPantry = { id: 456 };
      const post: IPost = { id: 69253 };
      userPantry.post = post;

      const postCollection: IPost[] = [{ id: 39714 }];
      jest.spyOn(postService, 'query').mockReturnValue(of(new HttpResponse({ body: postCollection })));
      const additionalPosts = [post];
      const expectedCollection: IPost[] = [...additionalPosts, ...postCollection];
      jest.spyOn(postService, 'addPostToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userPantry });
      comp.ngOnInit();

      expect(postService.query).toHaveBeenCalled();
      expect(postService.addPostToCollectionIfMissing).toHaveBeenCalledWith(
        postCollection,
        ...additionalPosts.map(expect.objectContaining)
      );
      expect(comp.postsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const userPantry: IUserPantry = { id: 456 };
      const user: IUser = { id: 27831 };
      userPantry.user = user;

      const userCollection: IUser[] = [{ id: 70389 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userPantry });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userPantry: IUserPantry = { id: 456 };
      const post: IPost = { id: 52655 };
      userPantry.post = post;
      const user: IUser = { id: 57433 };
      userPantry.user = user;

      activatedRoute.data = of({ userPantry });
      comp.ngOnInit();

      expect(comp.postsSharedCollection).toContain(post);
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.userPantry).toEqual(userPantry);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserPantry>>();
      const userPantry = { id: 123 };
      jest.spyOn(userPantryFormService, 'getUserPantry').mockReturnValue(userPantry);
      jest.spyOn(userPantryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userPantry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userPantry }));
      saveSubject.complete();

      // THEN
      expect(userPantryFormService.getUserPantry).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userPantryService.update).toHaveBeenCalledWith(expect.objectContaining(userPantry));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserPantry>>();
      const userPantry = { id: 123 };
      jest.spyOn(userPantryFormService, 'getUserPantry').mockReturnValue({ id: null });
      jest.spyOn(userPantryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userPantry: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userPantry }));
      saveSubject.complete();

      // THEN
      expect(userPantryFormService.getUserPantry).toHaveBeenCalled();
      expect(userPantryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserPantry>>();
      const userPantry = { id: 123 };
      jest.spyOn(userPantryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userPantry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userPantryService.update).toHaveBeenCalled();
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

    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
