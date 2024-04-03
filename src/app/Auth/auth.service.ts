import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken:string;
  expiresIn:string;
  localId:string;
  registered?:	boolean;
}


@Injectable()
export class AuthService {

  constructor( private http: HttpClient) { }

   signUp(email: string, password: string){
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDFB-q_YgXGKAITXAACcXH7jjcCELn4Zmo',
    {
      email: email,
      password: password,
      returnSecureToken: true

    });
  }
  
  login(email: string, password:string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDFB-q_YgXGKAITXAACcXH7jjcCELn4Zmo',
    {
      email: email,
      password: password,
      returnSecureToken: true

    });

  }
}
