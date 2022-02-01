import { Injectable } from '@angular/core';

import { HttpHeaders } from '@angular/common/http';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs'; //to handle asynchronous request and  response
import Swal from 'sweetalert2';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly APIUrl="http://localhost:5026/api/User";
  readonly APIUrl2="http://localhost:5026/api/Message";
  readonly PhotoUrl="http://localhost:5026/Photos";
  readonly HubUrl="http://localhost:5026/chatHub";
  public onlineUsers:any=[];
  constructor(private http:HttpClient) { }

  signUp(user:any): Observable<Object>{
    return this.http.post(this.APIUrl+'/signUp',user)
  }

  signIn(user:any): Observable<any>{
    return this.http.post<any>(this.APIUrl+'/signIn',user)
  }

  getAllUsers(headers:any){
    return this.http.get<any[]>(this.APIUrl,headers)
  }

  getUserById(userId:any): Observable<any>{
    return this.http.get<any>(this.APIUrl+userId)
  }

  AddMessage(message:any,headers:any): Observable<Object>{
    return this.http.post(this.APIUrl2+'/addMessage',message,headers)
  }

  getAllMessages(userId:any,contactId:any,headers:any){
    var currentUser=this.getCurrentUserFromLocalStorage();
    return this.http.get<any[]>(this.APIUrl2+'/getUserMessages/'+currentUser.id+'/'+contactId,headers)
  }

  getCurrentUserFromLocalStorage(): any{
    var currentUserJson=localStorage.getItem("currentUser");
    if(currentUserJson){
      return JSON.parse(currentUserJson);
    }
  }

  getJwtHttpOption(): { headers: HttpHeaders; }{
    var currentUser=this.getCurrentUserFromLocalStorage();
    return {
       headers: new HttpHeaders({
         'Authorization': currentUser.token
        })
     }
  }

  showSuccessMessage(text:string){
    Swal.fire({
      toast:true,
      icon:'success',
      title:text,
      position: 'top-right',
      showConfirmButton: false,
      timer: 4500,
      timerProgressBar: true,
    });
  }

  showErrorMessage(text:any){
    Swal.fire({
      toast:true,
      icon:'error',
      title:text,
      position: 'top-right',
      showConfirmButton: false,
      timer: 4500,
      timerProgressBar: true,
    });
  }

  createHubConnection(){
    return new HubConnectionBuilder().withUrl("http://localhost:5026/chatHub"
     , {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    }).build();
  }

  startHubConnection(hubConnection:any){
   hubConnection
  .start()
  .then( () => console.log('Connection started!'))
  .catch( () => console.log('Error while establishing connection :('));
  }

  setOnlineUsers(hubConnection:HubConnection){
    hubConnection.on('UserConnected', (userName:any) => {
      this.onlineUsers.push(userName);
    });
    console.log(this.onlineUsers);
  }
}