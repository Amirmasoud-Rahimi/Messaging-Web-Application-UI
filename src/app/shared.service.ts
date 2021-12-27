import { Injectable } from '@angular/core';

import {HttpClient, HttpClientModule} from '@angular/common/http';
import { Observable } from 'rxjs'; //to handle asynchronous request and  response

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  readonly APIUrl="http://localhost:2220/api";
  readonly PhotoUrl="http://localhost:2220/Photos";

  constructor(private http:HttpClient) { }

  signUp(person:any){
    return this.http.post(this.APIUrl+'/Person/AddPerson',person)
  }

  signIn(userName:any,password:any){
    return this.http.post<any>(this.APIUrl+'/Person/SignIn',{userName:userName,password:password})
  }

  getAllPersons(){
    return this.http.get(this.APIUrl+'/GetAllPersons')
  }

  getPersonById(personId:any){
    return this.http.get(this.APIUrl+'/GetPerson/'+personId)
  }
}
