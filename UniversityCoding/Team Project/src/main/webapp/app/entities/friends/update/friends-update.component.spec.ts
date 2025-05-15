import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FriendsFormService } from './friends-form.service';
import { FriendsService } from '../service/friends.service';
import { IFriends } from '../friends.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { FriendsUpdateComponent } from './friends-update.component';

describe('Friends Management Update Component', () => {
  let comp: FriendsUpdateComponent;
  let fixture: ComponentFixture<FriendsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let friendsFormService: FriendsFormService;
  let friendsService: FriendsService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FriendsUpdateComponent],
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
      .overrideTemplate(FriendsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FriendsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    friendsFormService = TestBed.inject(FriendsFormService);
    friendsService = TestBed.inject(FriendsService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const friends: IFriends = { id: 456 };
      const user_id1: IUser = { id: 32682 };
      friends.user_id1 = user_id1;
      const user_id2: IUser = { id: 97044 };
      friends.user_id2 = user_id2;

      const userCollection: IUser[] = [{ id: 22271 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user_id1, user_id2];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ friends });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const friends: IFriends = { id: 456 };
      const user_id1: IUser = { id: 33466 };
      friends.user_id1 = user_id1;
      const user_id2: IUser = { id: 30005 };
      friends.user_id2 = user_id2;

      activatedRoute.data = of({ friends });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user_id1);
      expect(comp.usersSharedCollection).toContain(user_id2);
      expect(comp.friends).toEqual(friends);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFriends>>();
      const friends = { id: 123 };
      jest.spyOn(friendsFormService, 'getFriends').mockReturnValue(friends);
      jest.spyOn(friendsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ friends });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: friends }));
      saveSubject.complete();

      // THEN
      expect(friendsFormService.getFriends).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(friendsService.update).toHaveBeenCalledWith(expect.objectContaining(friends));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFriends>>();
      const friends = { id: 123 };
      jest.spyOn(friendsFormService, 'getFriends').mockReturnValue({ id: null });
      jest.spyOn(friendsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ friends: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: friends }));
      saveSubject.complete();

      // THEN
      expect(friendsFormService.getFriends).toHaveBeenCalled();
      expect(friendsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFriends>>();
      const friends = { id: 123 };
      jest.spyOn(friendsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ friends });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(friendsService.update).toHaveBeenCalled();
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
  });
});
