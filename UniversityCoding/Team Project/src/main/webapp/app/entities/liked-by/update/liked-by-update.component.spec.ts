import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LikedByFormService } from './liked-by-form.service';
import { LikedByService } from '../service/liked-by.service';
import { ILikedBy } from '../liked-by.model';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { LikedByUpdateComponent } from './liked-by-update.component';

describe('LikedBy Management Update Component', () => {
  let comp: LikedByUpdateComponent;
  let fixture: ComponentFixture<LikedByUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let likedByFormService: LikedByFormService;
  let likedByService: LikedByService;
  let postService: PostService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LikedByUpdateComponent],
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
      .overrideTemplate(LikedByUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LikedByUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    likedByFormService = TestBed.inject(LikedByFormService);
    likedByService = TestBed.inject(LikedByService);
    postService = TestBed.inject(PostService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Post query and add missing value', () => {
      const likedBy: ILikedBy = { id: 456 };
      const post: IPost = { id: 15983 };
      likedBy.post = post;

      const postCollection: IPost[] = [{ id: 24504 }];
      jest.spyOn(postService, 'query').mockReturnValue(of(new HttpResponse({ body: postCollection })));
      const additionalPosts = [post];
      const expectedCollection: IPost[] = [...additionalPosts, ...postCollection];
      jest.spyOn(postService, 'addPostToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ likedBy });
      comp.ngOnInit();

      expect(postService.query).toHaveBeenCalled();
      expect(postService.addPostToCollectionIfMissing).toHaveBeenCalledWith(
        postCollection,
        ...additionalPosts.map(expect.objectContaining)
      );
      expect(comp.postsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const likedBy: ILikedBy = { id: 456 };
      const user: IUser = { id: 67555 };
      likedBy.user = user;

      const userCollection: IUser[] = [{ id: 26029 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ likedBy });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const likedBy: ILikedBy = { id: 456 };
      const post: IPost = { id: 73372 };
      likedBy.post = post;
      const user: IUser = { id: 2486 };
      likedBy.user = user;

      activatedRoute.data = of({ likedBy });
      comp.ngOnInit();

      expect(comp.postsSharedCollection).toContain(post);
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.likedBy).toEqual(likedBy);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILikedBy>>();
      const likedBy = { id: 123 };
      jest.spyOn(likedByFormService, 'getLikedBy').mockReturnValue(likedBy);
      jest.spyOn(likedByService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ likedBy });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: likedBy }));
      saveSubject.complete();

      // THEN
      expect(likedByFormService.getLikedBy).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(likedByService.update).toHaveBeenCalledWith(expect.objectContaining(likedBy));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILikedBy>>();
      const likedBy = { id: 123 };
      jest.spyOn(likedByFormService, 'getLikedBy').mockReturnValue({ id: null });
      jest.spyOn(likedByService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ likedBy: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: likedBy }));
      saveSubject.complete();

      // THEN
      expect(likedByFormService.getLikedBy).toHaveBeenCalled();
      expect(likedByService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILikedBy>>();
      const likedBy = { id: 123 };
      jest.spyOn(likedByService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ likedBy });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(likedByService.update).toHaveBeenCalled();
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
