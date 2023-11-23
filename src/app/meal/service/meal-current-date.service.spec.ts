import { TestBed } from '@angular/core/testing';
import { MealCurrentDateService } from './meal-current-date.service';
import { BehaviorSubject, of } from 'rxjs';
import { DateHelper } from '../../common/date/helper/date.helper';

describe('MealCurrentDateService', () => {
  let service: MealCurrentDateService;
  let currentDateSubjectMock: BehaviorSubject<Date>;

  beforeEach(() => {
    currentDateSubjectMock = new BehaviorSubject<Date>(new Date());

    jest.spyOn(currentDateSubjectMock, 'asObservable').mockReturnValue(of(new Date()));

    TestBed.configureTestingModule({
      providers: [
        MealCurrentDateService,
        { provide: BehaviorSubject, useValue: currentDateSubjectMock },
      ],
    });

    service = TestBed.inject(MealCurrentDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialize currentDate$ with invariable current date without timezone', () => {
    it('should set currentDate$ with invariable current date without timezone', () => {
      service = TestBed.inject(MealCurrentDateService);

      service.currentDate$.subscribe((currentDate) => {
        expect(currentDate).toEqual(DateHelper.getInvariantCurrentDateWithoutTimeZone());
      });
    });
  });

  describe('update currentDate$ when selectDate is called', () => {
    it('should update currentDate$ when selectDate is called', () => {
      const newDate = new Date();

      service.selectDate(newDate);

      service.currentDate$.subscribe((currentDate) => {
        expect(currentDate).toEqual(newDate);
      });
    });
  });
});