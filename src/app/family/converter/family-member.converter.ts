import { FamilyMemberDto } from "../dto/family-member.dto";
import { FamilyMember } from "../model/family-member.model";

export abstract class FamilyMemberConverter {
    public static fromDtoToModel(familyMemberDto: FamilyMemberDto): FamilyMember {
        return new FamilyMember(
            familyMemberDto.id ?? 0,
            familyMemberDto.userId,
            familyMemberDto.username ?? ''
          );
    }
}