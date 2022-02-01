import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { SignInComponent } from '../sign-in/sign-in.component';
import * as jQuery from 'jquery';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

let $: any = jQuery;//?

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.css']
})
export class ChatScreenComponent implements OnInit {
  element: any;
  private hubConnection!: HubConnection;
  public onlineUsers:any=[];
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
  msgs: Message[] = [];
  
  ngOnInit(): void {
    this.currentUser=this.service.getCurrentUserFromLocalStorage();
    this.getContactsList();
      //-----hub 
      this.hubConnection = this.service.createHubConnection();
     this.service.startHubConnection(this.hubConnection);

    this.hubConnection.on('MessageReceived', (message:any) => {
      this.messagesList.push(message);
    });
    this.hubConnection.on('UserConnected', (userName:any) => {
      this.onlineUsers.push(userName);
    });
    console.log(this.onlineUsers);
  }

  /*public sendMessageToHub(): void {
    this.hubConnection
    .invoke('sendToAll', this.nick, this.message)
    .catch(err => console.log(err));
  }*/
 
  getContactsList(): void{
    var currentUser=this.service.getCurrentUserFromLocalStorage();
    let httpOptions=this.service.getJwtHttpOption();
    this.service.getAllUsers(httpOptions).subscribe(
      {
          next:(response)=> {
            this.usersList=response
            this.usersList=this.usersList.filter((user: { id: any; })=>user.id!=currentUser.id);
          },
          error:(e) =>console.log(e),
          complete: () => console.log('complete')
      }
      )
  }

  getMessagesList(contactId:any):void{
    var currentUser=this.service.getCurrentUserFromLocalStorage();
    let httpOptions=this.service.getJwtHttpOption();
    this.service.getAllMessages(currentUser.id,contactId,httpOptions).subscribe(
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
      SenderId:currentUser.id,
      ReceiverId: this.contactId,
      MessageContent:this.text
    }
    this.service.AddMessage(message,httpOptions).subscribe(
      {
        error:(e) =>console.log(e),
        complete: () => {
          console.log('complete');
          this.text='';
          this.getMessagesList(this.contactId);
        }
      }
    )
  }
}
