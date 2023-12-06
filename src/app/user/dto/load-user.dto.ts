export class LoadUserDto {
    public constructor(
        public readonly id: number,
        public readonly firebaseId: string,
        public readonly email: string,
        public readonly username: string,
        public readonly familyId: number|undefined
    ) { }
}