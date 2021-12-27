import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  UserName!: String;
  Password!:String;
  
  constructor(private service:SharedService,private router:Router) { }

  ngOnInit(): void {}

    signIn(){
      var data={
        userName:this.UserName,
        password:this.Password
      }
      this.service.signIn(this.UserName,this.Password).subscribe(Response=>{
        alert(Response.toString());
        this.router.navigateByUrl('chatScreen')
      })
    }
}
