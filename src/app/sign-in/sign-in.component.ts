import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  UserName!: String;
  Password!:String;
  
  constructor(private service:SharedService,private router:Router,private jwtHelper: JwtHelperService) { }

  ngOnInit(): void {
   this.isTokenExpire();
  }

    signIn(){
      var user={
        userName:this.UserName,
        password:this.Password
      }
      this.service.signIn(user).subscribe(
        (response) => {
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.router.navigateByUrl('chatScreen');
        },
        (error) => {
          console.error(error);
          alert('Sign In Failed')
          //throw error;   //You can also throw the error to a global error handler
        })
    }

    isTokenExpire(){
      var currentUser=this.service.getCurrentUserFromLocalStorage();
      if (this.jwtHelper.isTokenExpired(currentUser.Token)) {
        this.router.navigateByUrl('signIn');
      } else {
        this.router.navigateByUrl('chatScreen');
      }
    }
}