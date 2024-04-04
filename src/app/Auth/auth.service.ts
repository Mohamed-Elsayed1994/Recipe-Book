import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';


export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken:string;
  expiresIn:string;
  localId:string;
  registered?:	boolean;
}


@Injectable()
export class AuthService {
  user = new BehaviorSubject<User>(null);

  constructor( private http: HttpClient) { }

   signUp(email: string, password: string){
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDFB-q_YgXGKAITXAACcXH7jjcCELn4Zmo',
    {
      email: email,
      password: password,
      returnSecureToken: true

    }).pipe(catchError(this.handleError),
     tap(resData =>{
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
     } ));
  }
  
  login(email: string, password: string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDFB-q_YgXGKAITXAACcXH7jjcCELn4Zmo',
    {
      email: email,
      password: password,
      returnSecureToken: true

    }).pipe(catchError(this.handleError),
    tap(resData =>{
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
     }));

  }
  private handleError(e: HttpErrorResponse){
    let errorMessage = new Error('Unknown error occured');

      if(!e.error || !e.error.error){
        return throwError(()=> errorMessage);
      }
     switch (e.error.error.message) {
      case "EMAIL_EXISTS":
          errorMessage = new Error ("The email address is already in use by another account.");
          break;
      case "EMAIL_NOT_FOUND":
        errorMessage = new Error("There is no user record corresponding to this identifier. The user may have been deleted.");
        break;
      case "INVALID_LOGIN_CREDENTIALS":
        errorMessage = new Error("The password or the email is invalid.");
        break;

      }
      return throwError(()=> errorMessage);

  }

  private handleAuthentication(email: string, userId:string, token: string, expiresIn: number){
    const expirationDate= new Date(new Date().getTime() + expiresIn*1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user)
  }
  
}
