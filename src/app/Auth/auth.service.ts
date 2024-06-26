import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';



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
  private tokenExpirationTimer: any;

  constructor( private http: HttpClient,
               private router:Router ) { }

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
  autoLogin(){
    const userData:{
      email: string;
      id:string;
      _token:string;
      _tokenExpirationDate: Date;
    } = JSON.parse(localStorage.getItem("userData"));

    if(!userData){
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData ._token,
      new Date(userData._tokenExpirationDate));

      if(loadedUser.token){
        this.user.next(loadedUser);
      }
      this.tokenExpirationTimer = null;

  }
  
  logout(){
    this.user.next(null);
    this.router.navigate(['/auth'])
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  autoLogout(expirationDuration: number){
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      
    }, expirationDuration);

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

  private handleAuthentication(
    email: string,
    userId:string,
    token: string,
    expiresIn: number){
    const expirationDate= new Date(new Date().getTime() + expiresIn*1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData',JSON.stringify(user));
  }
  
}
