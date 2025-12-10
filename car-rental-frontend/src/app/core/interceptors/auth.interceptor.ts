import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  if (token) {
    // Check if token is expired
    if (tokenService.isTokenExpired()) {
      console.warn('Token is expired, request may fail');
    }

    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  } else {
    console.warn('No token found, request may fail for protected endpoints');
  }

  return next(req);
};

