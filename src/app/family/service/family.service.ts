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
import { FamilyConverter } from '../converter/family.converter';
import { FamilyMemberConverter } from '../converter/family-member.converter';

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
          FamilyConverter.fromDtoToModel(loadFamilyDto)
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
          FamilyConverter.fromDtoToModel(loadFamilyDto)
        )
      );
  }

  private static createCreateFamilyDto(familyName: string, userId: number) {
    const createFamilyDto: CreateFamilyDto 
    = new CreateFamilyDto(familyName);

    const createFamilyMemberDto: CreateFamilyMemberDto 
    = new CreateFamilyMemberDto(userId);
    
    createFamilyDto.members.push(createFamilyMemberDto);

    return createFamilyDto;
  }

  public loadOneByAssociationCode(associationCode: string): Observable<Family|undefined> {
    return this.apiHttp.get<LoadFamilyDto[]>(
      `${environment.apiUrl}${FamilyService.apiPath}?associationCode=${associationCode}`
      )
      .pipe(
        map(loadFamilyDtos => {
            if (loadFamilyDtos.length) {
            return FamilyConverter.fromDtoToModel(loadFamilyDtos[0]);
            } else {
              return undefined;
            }
          }
        )
      );
  }

  public createFamilyMember(familyId: number, userId: number): Observable<FamilyMember> {
    const createFamilyMemberDto = new CreateFamilyMemberDto(userId);
    const body: string = JSON.stringify(createFamilyMemberDto);

    return this.apiHttp.post<LoadFamilyMemberDto>(
      `${environment.apiUrl}${FamilyService.apiPath}/${familyId}/family_members`,
      body
      )
      .pipe(
        map(loadFamilyMemberDto => 
            FamilyMemberConverter.fromDtoToModel(loadFamilyMemberDto)
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
}
