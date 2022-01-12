import { Injectable } from '@angular/core';

import { HttpHeaders } from '@angular/common/http';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs'; //to handle asynchronous request and  response

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly APIUrl="http://localhost:2220/api/user";
  readonly APIUrl2="http://localhost:2220/api/message";
  readonly PhotoUrl="http://localhost:2220/Photos";

  constructor(private http:HttpClient) { }

  signUp(user:any): Observable<Object>{
    return this.http.post(this.APIUrl+'/addUser',user)
  }

  signIn(user:any): Observable<any>{
    return this.http.post<any>(this.APIUrl+'/signIn',user)
  }

  getAllUsers(headers:any){
    return this.http.get<any[]>(this.APIUrl+'/getAllUsers',headers)
  }

  getUserById(userId:any): Observable<any>{
    return this.http.get<any>(this.APIUrl+'/getUser/'+userId)
  }

  AddMessage(message:any,headers:any): Observable<Object>{
    return this.http.post(this.APIUrl2+'/addMessage',message,headers)
  }

  getAllMessages(userId:any,contactId:any,headers:any){
    return this.http.get<any[]>(this.APIUrl2+'/getUserMessages/'+userId+'/'+contactId,headers)
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
         'Authorization': "Bearer " + currentUser.Token
        })
     }
  }
}