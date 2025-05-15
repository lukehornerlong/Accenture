import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserPantryService } from '../service/user-pantry.service';

import { UserPantryComponent } from './user-pantry.component';

describe('UserPantry Management Component', () => {
  let comp: UserPantryComponent;
  let fixture: ComponentFixture<UserPantryComponent>;
  let service: UserPantryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user-pantry', component: UserPantryComponent }]), HttpClientTestingModule],
      declarations: [UserPantryComponent],
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
      .overrideTemplate(UserPantryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserPantryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserPantryService);

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
    expect(comp.userPantries?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userPantryService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserPantryIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserPantryIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
