import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private isAuthenticated = false;
  public  TOKEN_KEY = 'auth_token';
  public  EXPIRY_KEY = 'auth_token_expiry';
  public  EXPIRY_TIME_MS = 30 * 60 * 1000; // 30 minutes
  public USER_ID_KEY = 'user_id';


  constructor(private router: Router, private userService: UserService) {
    this.checkSessionValidity();
  }

  login(email: string, password: string): Observable<any> {
    return this.userService.login(email, password).pipe(
      tap((user) => {
        if (user) {
          // this.isAuthenticated = true;
          this.storeSessionData(user.user_id);
          this.router.navigate(['/home']);
        } else {
          this.logout();

          // this.isAuthenticated = false;
        }
      })
      
    );
  }

  private storeSessionData(userId:any): void {
    const expiryTime = new Date().getTime() + this.EXPIRY_TIME_MS;
    localStorage.setItem(this.TOKEN_KEY, 'true');
    localStorage.setItem(this.EXPIRY_KEY, expiryTime.toString());
    localStorage.setItem(this.USER_ID_KEY, userId); // Store the user ID

  }

  private checkSessionValidity(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiry = localStorage.getItem(this.EXPIRY_KEY);

    if (token && expiry) {
      const now = new Date().getTime();
      if (now < +expiry) {
        // this.isAuthenticated = true;
        // this.router.navigate(['/home']);
        window.scrollTo(0, 0);
      } else {
        this.logout();  // session expired
      }
    }
  }

  logout(): void {
    // this.isAuthenticated = false;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);
    localStorage.removeItem(this.USER_ID_KEY); // Remove the user ID
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiry = localStorage.getItem(this.EXPIRY_KEY);
    if (token && expiry) {
      const now = new Date().getTime();
      return now < +expiry;
    }
    return false;
  
    // return this.isAuthenticated;
  }
  getUserId(): string | null {
    return localStorage.getItem(this.USER_ID_KEY); // Retrieve the user ID
  }
}
