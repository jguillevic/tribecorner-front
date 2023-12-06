import { LoadFamilyDto } from "../dto/load-family.dto";
import { FamilyMember } from "../model/family-member.model";
import { Family } from "../model/family.model";
import { FamilyMemberConverter } from "./family-member.converter";

export abstract class FamilyConverter {
    public static fromDtoToModel(loadFamilyDto: LoadFamilyDto): Family {
        const family: Family 
        = new Family(
          loadFamilyDto.id,
          loadFamilyDto.name,
          loadFamilyDto.associationCode
        );
    
        loadFamilyDto.members.forEach(loadFamilyMemberDto => {
          const familyMember: FamilyMember = FamilyMemberConverter.fromDtoToModel(loadFamilyMemberDto);
          family.members.push(familyMember);
        });
    
        return family;
    }
}