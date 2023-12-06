export class CreateUserDto {
    public constructor(
        public readonly firebaseId: string,
        public readonly email: string,
        public readonly username: string
    ) { }
}