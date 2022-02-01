import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';

let regex='//"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]?).{8,}$"';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  
  fullName!:String;
  userName!:String;
  password!:String;
  @Input() person:any; //?

  constructor(private service:SharedService,private router:Router) { }

  ngOnInit(): void {}

  signUp(){
    var user={
      userName:this.userName,
      fullName:this.fullName,
      password:this.password
    }
    this.service.signUp(user).subscribe( //Deprecated?
      (response) => {
        console.log(response)
        this.router.navigateByUrl('signIn')
      },
      (error) => {
        console.error(error);
        this.service.showErrorMessage(String(error.error.errors.Password[0]))//fix
        //throw error;   //You can also throw the error to a global error handler
      }
    )
    }
}