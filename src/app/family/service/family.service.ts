import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Family } from '../model/family.model';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadFamilyDto } from '../dto/load-family.dto';
import { LoadFamilyMemberDto } from '../dto/load-family-member.dto';
import { FamilyMember } from '../model/family-member.model';
import { CreateFamilyDto } from '../dto/create-family.dto';
import { CreateFamilyMemberDto } from '../dto/create-family-member.dto';

@Injectable()
export class FamilyService {
  private static apiPath: string = 'families';

  constructor(private http: HttpClient) { }

  public load(familyId: number): Observable<Family|undefined> {
    const headers: HttpHeaders = new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json');

    return this.http.get<LoadFamilyDto>(
      `${environment.apiUrl}${FamilyService.apiPath}/${familyId}`
      )
      .pipe(
        switchMap((loadFamilyDto) => {
          return of(FamilyService.fromLoadFamilyDtoToFamily(loadFamilyDto));
        }),
        catchError((error) => { 
          console.log(error);
          return of(undefined);
        })
      );
  }

  public create(familyName: string, userId: number): Observable<Family|undefined> {
    const headers: HttpHeaders = new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json');

    const createFamilyDto: CreateFamilyDto = FamilyService.createCreateFamilyDto(familyName, userId);

    const body: string = JSON.stringify(createFamilyDto);

    return this.http.post<LoadFamilyDto>(
      `${environment.apiUrl}${FamilyService.apiPath}`,
      body, 
      { 'headers': headers }
      )
      .pipe(
        switchMap((loadFamilyDto) => {
          return of(FamilyService.fromLoadFamilyDtoToFamily(loadFamilyDto));
        }),
        catchError((error) => { 
          console.log(error);
          return of(undefined);
        })
      );
  }

  private static createCreateFamilyDto(familyName: string, userId: number) {
    const createFamilyDto: CreateFamilyDto = new CreateFamilyDto();
    createFamilyDto.name = familyName;

    const createFamilyMemberDto: CreateFamilyMemberDto = new CreateFamilyMemberDto();
    createFamilyMemberDto.userId = userId;
    
    createFamilyDto.members.push(createFamilyMemberDto);

    return createFamilyDto;
  }

  public loadFromAssociationCode(associationCode: string): Observable<Family|undefined> {
    const headers: HttpHeaders = new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json');

    return this.http.get<LoadFamilyDto[]>(
      `${environment.apiUrl}${FamilyService.apiPath}?associationCode=${associationCode}`,
      { 'headers': headers }
      )
      .pipe(
        switchMap((loadFamilyDtos) => {
          const loadFamilyDto: LoadFamilyDto|undefined = loadFamilyDtos.at(0);
          if (loadFamilyDto) {
            return of(FamilyService.fromLoadFamilyDtoToFamily(loadFamilyDto));
          }
          return of (undefined);
        }),
        catchError((error) => { 
          console.log(error);
          return of(undefined);
        })
      );
  }

  public createFamilyMember(familyId: number, userId: number): Observable<FamilyMember|undefined> {
    const headers: HttpHeaders = new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Accept', 'application/json');

    const createFamilyMemberDto = new CreateFamilyMemberDto();
    createFamilyMemberDto.userId = userId;
    const body: string = JSON.stringify(createFamilyMemberDto);

    return this.http.post<LoadFamilyMemberDto>(
      `${environment.apiUrl}${FamilyService.apiPath}/${familyId}/family_members`,
      body,
      { 'headers': headers }
      )
      .pipe(
        switchMap((loadFamilyMemberDto) => {
            return of(FamilyService.fromLoadFamilyMemberDtoToFamilyMember(loadFamilyMemberDto));
        }),
        catchError((error) => { 
          console.log(error);
          return of(undefined);
        })
      );
  }

  public joinFamily(associationCode: string, userId: number): Observable<FamilyMember|undefined> {
    return this.loadFromAssociationCode(associationCode)
    .pipe(
      switchMap((family) => {
        if (family) {
          return this.createFamilyMember(family.id, userId);
        }
        return of(undefined);
      })
    )
  }

  private static fromLoadFamilyDtoToFamily(loadFamilyDto: LoadFamilyDto): Family {
    const family: Family = new Family();

    family.id = loadFamilyDto.id;
    family.name = loadFamilyDto.name;
    family.associationCode = loadFamilyDto.associationCode;
    loadFamilyDto.members.forEach(loadFamilyMemberDto => {
      const familyMember: FamilyMember = FamilyService.fromLoadFamilyMemberDtoToFamilyMember(loadFamilyMemberDto);
      family.members.push(familyMember);
    });

    return family;
  }

  private static fromLoadFamilyMemberDtoToFamilyMember(loadFamilyMemberDto: LoadFamilyMemberDto): FamilyMember {
    const familyMember = new FamilyMember();

    familyMember.id = loadFamilyMemberDto.id;
    familyMember.name = loadFamilyMemberDto.name;
    familyMember.userId = loadFamilyMemberDto.userId;
    familyMember.username = loadFamilyMemberDto.username;

    return familyMember;
  } 
}
