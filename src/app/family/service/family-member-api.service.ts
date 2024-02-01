import {Injectable} from '@angular/core';
import {ApiHttpClient} from '../../common/http/api-http-client';
import {Observable, map} from 'rxjs';
import {FamilyMember} from '../model/family-member.model';
import {FamilyMemberDto} from '../dto/family-member.dto';
import {environment} from '../../../environments/environment';
import {FamilyMemberConverter} from '../converter/family-member.converter';

@Injectable({
    providedIn: 'root'
})
export class FamilyMemberApiService {
    private static apiPath: string = 'family_members';

    public constructor(
        private apiHttp: ApiHttpClient
    ) { }
    
    public create(familyId: number, userId: number): Observable<FamilyMember> {
        const familyMemberDto = new FamilyMemberDto(undefined, familyId, userId, undefined);
        const body: string = JSON.stringify(familyMemberDto);

        return this.apiHttp.post<FamilyMemberDto>(
        `${environment.apiUrl}${FamilyMemberApiService.apiPath}`,
        body
        )
        .pipe(
            map((familyMemberDto: FamilyMemberDto) => 
                FamilyMemberConverter.fromDtoToModel(familyMemberDto)
            )
        );
    }
}
