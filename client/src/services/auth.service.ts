import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/models/User';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api: string = '';

  constructor(private http: HttpClient, private localStorageService: LocalstorageService) {
    this.api = `http://localhost:3000/api/auth`;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/login`, {email: email, password: password});
  }

  checkToken(token: string): Observable<any> {
    return this.http.post(`${this.api}/checkToken`, {token: token});
  }

  registerLocalStorage(loginData: any): void {
    this.localStorageService.setItem('name', loginData.name);
    this.localStorageService.setItem('surname', loginData.surname);
    this.localStorageService.setItem('email', loginData.email);
    this.localStorageService.setItem('role', loginData.role);
    this.localStorageService.setItem('token', loginData.token);
  }

  getUserInformation(): User {
    let user: User = new User();
    user.name = this.localStorageService.getItem('name') || '';
    user.surname = this.localStorageService.getItem('surname') || '';
    user.email = this.localStorageService.getItem('email') || '';
    user.role = Number(this.localStorageService.getItem('role')) || 0;

    return user;
  }

  isLoggedIn(): boolean {
    return this.localStorageService.hasItem("token");
  }
}
