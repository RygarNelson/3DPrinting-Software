import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api: string = '';

  constructor(private http: HttpClient) {
    this.api = `http://localhost:3000/api/auth`;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/login`, {email: email, password: password});
  }

  checkToken(token: string): Observable<any> {
    return this.http.post(`${this.api}/checkToken`, {token: token});
  }

  registerLocalStorage(loginData: any): void {
    localStorage.setItem('name', loginData.name);
    localStorage.setItem('surname', loginData.surname);
    localStorage.setItem('email', loginData.email);
    localStorage.setItem('role', loginData.role);
    localStorage.setItem('token', loginData.token);
  }

  removeLocalStorage(): void {
    localStorage.removeItem('name');
    localStorage.removeItem('surname');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
  }

  getUserInformation(): User {
    let user: User = new User();
    user.name = localStorage.getItem('name') || '';
    user.surname = localStorage.getItem('surname') || '';
    user.email = localStorage.getItem('email') || '';
    user.role = Number(localStorage.getItem('role')) || 0;

    return user;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem("token");
  }
}
