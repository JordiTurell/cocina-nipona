import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})

export class AuthServices {
  private baseUrl: string = `${environment}`;

  constructor(private http: HttpClient){

  }

  login(){
    return this.http.post(this.baseUrl + '/login', {});
  }

  regiger(){
    return this.http.post(this.baseUrl + '/register', {});
  }

}
