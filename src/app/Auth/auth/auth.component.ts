import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  isLoginMode = true;
  error: string = null;

  constructor(private authService: AuthService){}

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    
    const email = form.value.email;
    const password = form.value.password;

    if(this.isLoginMode){
      this.authService.login(email, password).subscribe({
        next: (v) => console.log(v),
        error: (e) =>{
          console.error(e); 
          this.error = 'an error occured!'
        } ,
        complete: () => console.info('complete') 
    });


    }else {
      
    this.authService.signUp(email, password).subscribe({
      next: (v) => console.log(v),
      error: (e) =>{
        console.error(e); 
        this.error = 'an error occured!'
      } ,
      complete: () => console.info('complete') 
  });

    
  }
  form.reset();


  }

}
