import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  step: 'email' | 'otp' | 'password' = 'email';
  emailForm: FormGroup;
  otpForm: FormGroup;
  passwordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  email = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword) {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  verifyEmail(): void {
    if (this.emailForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.email = this.emailForm.value.email;

      this.authService.verifyEmail({ email: this.email }).subscribe({
        next: (response) => {
          if (response.success) {
            this.step = 'otp';
            this.successMessage = 'OTP sent to your email';
          } else {
            this.errorMessage = response.message || 'Email verification failed';
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'An error occurred';
          this.isLoading = false;
        }
      });
    }
  }

  sendOtp(): void {
    if (this.emailForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.email = this.emailForm.value.email;

      this.apiService.post('Otp/send', { email: this.email }).subscribe({
        next: (response) => {
          if (response.success) {
            this.step = 'otp';
            this.successMessage = 'OTP sent to your email';
          } else {
            this.errorMessage = response.message || 'Failed to send OTP';
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'An error occurred';
          this.isLoading = false;
        }
      });
    }
  }

  verifyOtp(): void {
    if (this.otpForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.apiService.post('Otp/verify', {
        email: this.email,
        otp: this.otpForm.value.otp
      }).subscribe({
        next: (response) => {
          if (response.success) {
            this.step = 'password';
            this.successMessage = 'OTP verified successfully';
          } else {
            this.errorMessage = response.message || 'Invalid OTP';
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'An error occurred';
          this.isLoading = false;
        }
      });
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.changePassword({
        email: this.email,
        newPassword: this.passwordForm.value.newPassword,
        confirmPassword: this.passwordForm.value.confirmPassword
      }).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Password changed successfully. Redirecting to login...';
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 2000);
          } else {
            this.errorMessage = response.message || 'Failed to change password';
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'An error occurred';
          this.isLoading = false;
        }
      });
    }
  }
}

