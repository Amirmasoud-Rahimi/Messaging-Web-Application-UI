import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';
import { HubConnection } from '@microsoft/signalr';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  private hubConnection!: HubConnection;
  public onlineUsers:any=[];
  UserName!: String;
  Password!:String;
  
  constructor(private service:SharedService,private router:Router,private jwtHelper: JwtHelperService) { }

  ngOnInit(): void {
   this.isTokenExpire();
   this.hubConnection = this.service.createHubConnection();
   this.service.startHubConnection(this.hubConnection);
   //this.service.setOnlineUsers(this.hubConnection);
    this.hubConnection.on('UserConnected', (userName:any) => {
     this.onlineUsers.push(userName);
   });
   console.log(this.onlineUsers);
  }
  
    signIn(){
      var signIn={
        userName:this.UserName,
        password:this.Password
      }
      this.service.signIn(signIn).subscribe(
        (response) => {
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.router.navigateByUrl('chatScreen');
        },
        (error) => {
          console.error(error);
          this.service.showErrorMessage("Login Failed");
          //throw error;   //You can also throw the error to a global error handler
        })
    }

    isTokenExpire(){
      var currentUser=this.service.getCurrentUserFromLocalStorage();
      if (currentUser==undefined || this.jwtHelper.isTokenExpired(currentUser.token)) {
        this.router.navigateByUrl('signIn');
      } else {
        this.router.navigateByUrl('chatScreen');
      }
    }
}