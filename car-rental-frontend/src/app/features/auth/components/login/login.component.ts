import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginRequest: LoginRequest = this.loginForm.value;

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          if (response.success) {
            const user = this.authService.getCurrentUser();
            // Redirect based on role
            if (user?.role === 'Admin' || user?.role === 'Staff') {
              this.router.navigate(['/admin/dashboard']);
            } else if (user?.role === 'Customer') {
              this.router.navigate(['/customer/dashboard']);
            } else if (user?.role === 'Driver') {
              this.router.navigate(['/driver/dashboard']);
            } else {
              this.router.navigate(['/']);
            }
          } else {
            this.errorMessage = response.message || 'Login failed';
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'An error occurred during login';
          this.isLoading = false;
        }
      });
    }
  }
}

