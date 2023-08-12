import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  constructor() { }

  signup(): void {
    console.log("Service création.");
  }

  signin(): void {
    console.log("Service connexion.");
  }
}
