import { Injectable } from '@angular/core';
import { Family } from '../model/family.model';
import { Observable, map, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadFamilyDto } from '../dto/load-family.dto';
import { LoadFamilyMemberDto } from '../dto/load-family-member.dto';
import { FamilyMember } from '../model/family-member.model';
import { CreateFamilyDto } from '../dto/create-family.dto';
import { CreateFamilyMemberDto } from '../dto/create-family-member.dto';
import { AssociationCodeNotFoundError } from '../error/association-code-not-found.error';
import { ApiHttpClient } from 'src/app/common/http/api-http-client';

@Injectable()
export class FamilyService {
  private static apiPath: string = 'families';

  public constructor(private apiHttp: ApiHttpClient) { }

  public loadOneByFamilyId(familyId: number): Observable<Family> {
    return this.apiHttp.get<LoadFamilyDto>(
      `${environment.apiUrl}${FamilyService.apiPath}/${familyId}`
      )
      .pipe(
        map(loadFamilyDto => 
          FamilyService.fromLoadFamilyDtoToFamily(loadFamilyDto)
        )
      );
  }

  public create(familyName: string, userId: number): Observable<Family> {
    const createFamilyDto: CreateFamilyDto = FamilyService.createCreateFamilyDto(familyName, userId);
    const body: string = JSON.stringify(createFamilyDto);

    return this.apiHttp.post<LoadFamilyDto>(
      `${environment.apiUrl}${FamilyService.apiPath}`,
      body
      )
      .pipe(
        map(loadFamilyDto => 
          FamilyService.fromLoadFamilyDtoToFamily(loadFamilyDto)
        )
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

  public loadOneByAssociationCode(associationCode: string): Observable<Family> {
    return this.apiHttp.get<LoadFamilyDto>(
      `${environment.apiUrl}${FamilyService.apiPath}?associationCode=${associationCode}`
      )
      .pipe(
        map(loadFamilyDto => 
            FamilyService.fromLoadFamilyDtoToFamily(loadFamilyDto)
        )
      );
  }

  public createFamilyMember(familyId: number, userId: number): Observable<FamilyMember> {
    const createFamilyMemberDto = new CreateFamilyMemberDto();
    createFamilyMemberDto.userId = userId;
    const body: string = JSON.stringify(createFamilyMemberDto);

    return this.apiHttp.post<LoadFamilyMemberDto>(
      `${environment.apiUrl}${FamilyService.apiPath}/${familyId}/family_members`,
      body
      )
      .pipe(
        map(loadFamilyMemberDto => 
            FamilyService.fromLoadFamilyMemberDtoToFamilyMember(loadFamilyMemberDto)
        )
      );
  }

  public joinFamily(associationCode: string, userId: number): Observable<FamilyMember|undefined> {
    return this.loadOneByAssociationCode(associationCode)
    .pipe(
      switchMap(family => {
        if (family) {
          if (family.id) {
            return this.createFamilyMember(family.id, userId);
          } else {
            return of (undefined);
          }
        } else {
          throw new AssociationCodeNotFoundError();
        }
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
