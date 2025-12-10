import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { TokenService } from './token.service';
import { LoginRequest, LoginResponse, RegisterRequest, VerifyEmailRequest, ChangePasswordRequest, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private tokenService: TokenService
  ) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.apiService.post<LoginResponse>('Account/login', credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.tokenService.setToken(response.data.token);
          const user: User = {
            userId: response.data.userId,
            name: response.data.name,
            email: credentials.email,
            role: response.data.role
          };
          this.storageService.setUser(user);
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.apiService.post('Account/register', userData);
  }

  verifyEmail(request: VerifyEmailRequest): Observable<any> {
    return this.apiService.post('Account/verify-email', request);
  }

  changePassword(request: ChangePasswordRequest): Observable<any> {
    return this.apiService.post('Account/change-password', request);
  }

  logout(): void {
    this.tokenService.removeToken();
    this.storageService.removeUser();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = this.tokenService.getToken();
    return !!token && !this.tokenService.isTokenExpired();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  private loadUserFromStorage(): void {
    const user = this.storageService.getUser();
    if (user && this.isAuthenticated()) {
      this.currentUserSubject.next(user);
    }
  }
}

