import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SharedService } from '../shared.service';
import * as jQuery from 'jquery';
import { Router } from '@angular/router';

let $: any = jQuery;//?

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.css']
})
export class ChatScreenComponent implements OnInit {
  element: any;
 
  constructor(private service:SharedService,private router:Router) { }

  usersList:any=[];
  messagesList:any=[];
  currentUser:any;
  fullName!:String;
  userName!:String;
  contactName!:String;
  text!:String;
  userId!:any;
  contactId:any;

  ngOnInit(): void {
    this.currentUser=this.service.getCurrentUserFromLocalStorage();
    this.getContactsList();
  }

  getContactsList(): void{
    var currentUser=this.service.getCurrentUserFromLocalStorage();
    let httpOptions=this.service.getJwtHttpOption();
    this.service.getAllUsers(httpOptions).subscribe(
      {
          next:(response)=> {
            this.usersList=response
            this.usersList=this.usersList.filter((user: { Id: any; })=>user.Id!=currentUser.Id);
          },
          error:(e) =>console.log(e),
          complete: () => console.log('complete')
      }
      )
  }

  getMessagesList(contactId:any):void{
    var currentUser=this.service.getCurrentUserFromLocalStorage();
    let httpOptions=this.service.getJwtHttpOption();
    this.service.getAllMessages(currentUser.Id,contactId,httpOptions).subscribe(
      {
          next:(response)=> this.messagesList=response,
          error:(e) =>console.log(e),
          complete: () => console.log('complete')
      }
      )
  }

  logOut(): void{
    localStorage.removeItem("currentUser");
    this.router.navigateByUrl("signIn")
  }

  startChat(contactId: any){
    this.contactId=contactId;
  this.getMessagesList(contactId);
  }

  sendMessage(){
    var currentUser=this.service.getCurrentUserFromLocalStorage();
    let httpOptions=this.service.getJwtHttpOption();
    var message={
      SenderId:currentUser.Id,
      ReceiverId: this.contactId,
      MessageContent:this.text
    }
    this.service.AddMessage(message,httpOptions).subscribe(
      {
        error:(e) =>console.log(e),
        complete: () => {
          console.log('complete');
          this.getMessagesList(this.contactId);
        }
      }
    )
  }
}
