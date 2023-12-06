import { LoadFamilyMemberDto } from "../dto/load-family-member.dto";
import { FamilyMember } from "../model/family-member.model";

export abstract class FamilyMemberConverter {
    public static fromDtoToModel(loadFamilyMemberDto: LoadFamilyMemberDto): FamilyMember {
        return new FamilyMember(
            loadFamilyMemberDto.id,
            loadFamilyMemberDto.name,
            loadFamilyMemberDto.userId,
            loadFamilyMemberDto.username
          );
    }
}