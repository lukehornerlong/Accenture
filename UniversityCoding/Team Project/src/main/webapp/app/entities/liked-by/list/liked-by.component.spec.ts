import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LikedByService } from '../service/liked-by.service';

import { LikedByComponent } from './liked-by.component';

describe('LikedBy Management Component', () => {
  let comp: LikedByComponent;
  let fixture: ComponentFixture<LikedByComponent>;
  let service: LikedByService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'liked-by', component: LikedByComponent }]), HttpClientTestingModule],
      declarations: [LikedByComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(LikedByComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LikedByComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LikedByService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.likedBies?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to likedByService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLikedByIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLikedByIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
