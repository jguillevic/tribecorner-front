import { TestBed } from '@angular/core/testing';
import { EventCurrentDateService } from './event-current-date.service';
import { BehaviorSubject, of } from 'rxjs';
import { DateHelper } from '../../common/date/helper/date.helper';

describe('MealCurrentDateService', () => {
  let service: EventCurrentDateService;
  let currentDateSubjectMock: BehaviorSubject<Date>;

  beforeEach(() => {
    currentDateSubjectMock = new BehaviorSubject<Date>(new Date());

    jest.spyOn(currentDateSubjectMock, 'asObservable').mockReturnValue(of(new Date()));

    TestBed.configureTestingModule({
      providers: [
        EventCurrentDateService,
        { provide: BehaviorSubject, useValue: currentDateSubjectMock },
      ],
    });

    service = TestBed.inject(EventCurrentDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialize currentDate$ with invariable current date without timezone', () => {
    it('should set currentDate$ with invariable current date without timezone', () => {
      service = TestBed.inject(EventCurrentDateService);

      service.currentDate$.subscribe((currentDate) => {
        expect(currentDate).toEqual(DateHelper.getInvariantCurrentDate());
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