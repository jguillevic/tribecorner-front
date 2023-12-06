import { CreateUserDto } from "../dto/create-user.dto";
import { LoadUserDto } from "../dto/load-user.dto";
import { SignUpUser } from "../model/sign-up-user.model";
import { UserInfo } from "../model/user-info.model";

export abstract class UserConverter {
    public static fromDtoToModel(loadUserDto: LoadUserDto): UserInfo {
        const userInfo 
        = new UserInfo(
            loadUserDto.id,
            loadUserDto.firebaseId,
            loadUserDto.email,
            loadUserDto.username,
            loadUserDto.familyId
        );
    
        return userInfo;
    }

    public static fromModelToDto(firebaseId: string, signUpUser: SignUpUser): CreateUserDto {
        return new CreateUserDto(
            firebaseId,
            signUpUser.email,
            signUpUser.username
        );
      }
}