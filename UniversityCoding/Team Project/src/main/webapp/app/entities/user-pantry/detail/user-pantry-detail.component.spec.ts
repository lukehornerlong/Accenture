import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserPantryDetailComponent } from './user-pantry-detail.component';

describe('UserPantry Management Detail Component', () => {
  let comp: UserPantryDetailComponent;
  let fixture: ComponentFixture<UserPantryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserPantryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userPantry: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserPantryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserPantryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userPantry on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userPantry).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
