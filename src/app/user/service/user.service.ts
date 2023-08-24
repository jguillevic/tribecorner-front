import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, Auth, User } from "firebase/auth";
import { environment } from 'src/environments/environment.development';
import { SignUpUser } from '../model/sign-up-user';
import { UserInfo } from '../model/user-info';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class UserService {

  constructor() { }

  signUp(signUpUser: SignUpUser): void {
    const app: FirebaseApp = initializeApp(environment.firebaseConfig);
    const auth: Auth = getAuth(app);

    createUserWithEmailAndPassword(auth, signUpUser.email, signUpUser.password)
    .then((userCredential) => {
      // L'utilisateur est enregistré.

      // Enregistrement des informations spécifiques à l'application.
    })
    .catch((error) => {
      window.alert(error);
    });
  }

  signIn(email: string, password: string): void {
    console.log("Service connexion.");
  }
}