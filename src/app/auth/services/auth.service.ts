import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Auth } from '../interfaces/auth.interfaces';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http: HttpClient;
  private url: string  = environment.baseUrl;
  private _auth: Auth | undefined;


  constructor( http: HttpClient) { 
    this.http = http;
  }

  getUsuario(): Observable<Auth[]> {
    return this.http.get<Auth[]>(`${this.url}/users`);
  }

  verificaAutenticacion():Observable <boolean>{
    if(!localStorage.getItem('token')){
      return  of(false);
    }
    return this.http.get<Auth>(`${this.url}/users/`)
    .pipe(
      map( auth => {
        this._auth = auth;
        return true;
      })
    );
  }

  login(id:string){
    return this.http.get<Auth>(`${this.url}/users/${ id }`)
    .pipe(
      tap (auth => this._auth = auth),
      tap(auth => localStorage.setItem('token', auth.id))
    );
  }

  get auth():Auth{
    return {...this._auth!};
  }
}
