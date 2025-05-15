import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FriendsService } from '../service/friends.service';

import { FriendsComponent } from './friends.component';

describe('Friends Management Component', () => {
  let comp: FriendsComponent;
  let fixture: ComponentFixture<FriendsComponent>;
  let service: FriendsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'friends', component: FriendsComponent }]), HttpClientTestingModule],
      declarations: [FriendsComponent],
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
      .overrideTemplate(FriendsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FriendsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FriendsService);

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
    expect(comp.friends?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to friendsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getFriendsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getFriendsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
