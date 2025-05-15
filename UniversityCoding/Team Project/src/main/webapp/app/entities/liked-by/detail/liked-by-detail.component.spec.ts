import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LikedByDetailComponent } from './liked-by-detail.component';

describe('LikedBy Management Detail Component', () => {
  let comp: LikedByDetailComponent;
  let fixture: ComponentFixture<LikedByDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LikedByDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ likedBy: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LikedByDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LikedByDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load likedBy on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.likedBy).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
