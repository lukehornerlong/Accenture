import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DietaryTagsDetailComponent } from './dietary-tags-detail.component';

describe('DietaryTags Management Detail Component', () => {
  let comp: DietaryTagsDetailComponent;
  let fixture: ComponentFixture<DietaryTagsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DietaryTagsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ dietaryTags: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DietaryTagsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DietaryTagsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load dietaryTags on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.dietaryTags).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
