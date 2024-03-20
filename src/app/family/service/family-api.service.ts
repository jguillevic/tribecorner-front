import {Injectable} from '@angular/core';
import {Family} from '../model/family.model';
import {Observable, exhaustMap, map, of, shareReplay, switchMap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {LoadFamilyDto} from '../dto/load-family.dto';
import {FamilyMemberDto} from '../dto/family-member.dto';
import {FamilyMember} from '../model/family-member.model';
import {CreateFamilyDto} from '../dto/create-family.dto';
import {AssociationCodeNotFoundError} from '../error/association-code-not-found.error';
import {ApiHttpClient} from 'src/app/common/http/api-http-client';
import {FamilyConverter} from '../converter/family.converter';
import {UserService} from '../../user/service/user.service';
import {UserInfo} from '../../user/model/user-info.model';
import { FamilyMemberApiService } from './family-member-api.service';

@Injectable({
  providedIn: 'root',
})
export class FamilyApiService {
  private static apiPath: string = 'families';

  public constructor(
    private apiHttp: ApiHttpClient,
    private userService: UserService,
    private familyMemberApiService: FamilyMemberApiService
  ) { }

  public family$: Observable<Family|undefined> 
  = this.getFamily();

  private getFamily(): Observable<Family|undefined> {
    if (this.userService.userInfo && this.userService.userInfo.familyId) {
      return this.loadOneByFamilyId(this.userService.userInfo.familyId); 
    }
    return of(undefined);
  }

  public loadOneByFamilyId(familyId: number): Observable<Family> {
    return this.apiHttp.get<LoadFamilyDto>(
      `${environment.apiUrl}${FamilyApiService.apiPath}/${familyId}`
      )
      .pipe(
        map(loadFamilyDto => 
          FamilyConverter.fromDtoToModel(loadFamilyDto)
        ),
        shareReplay(1)
      );
  }

  public create(familyName: string, userId: number): Observable<Family> {
    const createFamilyDto: CreateFamilyDto = FamilyApiService.createCreateFamilyDto(familyName, userId);
    const body: string = JSON.stringify(createFamilyDto);

    return this.apiHttp.post<LoadFamilyDto>(
      `${environment.apiUrl}${FamilyApiService.apiPath}`,
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

    const familyMemberDto: FamilyMemberDto 
    = new FamilyMemberDto(undefined, undefined, userId, undefined);
    
    createFamilyDto.members.push(familyMemberDto);

    return createFamilyDto;
  }

  private loadOneByAssociationCode(associationCode: string): Observable<Family|undefined> {
    return this.apiHttp.get<LoadFamilyDto[]>(
      `${environment.apiUrl}${FamilyApiService.apiPath}?associationCode=${associationCode}`
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

  public joinFamily(associationCode: string, userId: number): Observable<FamilyMember|undefined> {
    return this.loadOneByAssociationCode(associationCode)
    .pipe(
      switchMap(family => {
        if (family) {
          if (family.id) {
            return this.familyMemberApiService.create(family.id, userId);
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
