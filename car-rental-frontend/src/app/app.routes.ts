import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/components/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      }
    ]
  },
  {
    path: 'customer',
    canActivate: [authGuard, roleGuard(['Customer'])],
    loadComponent: () => import('./features/customer/components/layout/customer-layout.component').then(m => m.CustomerLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/customer/components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/components/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivateChild: [authGuard, roleGuard(['Admin', 'Staff'])],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'cars',
        loadComponent: () => import('./features/admin/components/cars/cars.component').then(m => m.CarsComponent)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./features/admin/components/bookings/bookings.component').then(m => m.BookingsComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./features/admin/components/customers/customers.component').then(m => m.CustomersComponent)
      },
      {
        path: 'staff',
        loadComponent: () => import('./features/admin/components/staff/staff.component').then(m => m.StaffComponent)
      },
      {
        path: 'drivers',
        loadComponent: () => import('./features/admin/components/drivers/drivers.component').then(m => m.DriversComponent)
      },
      {
        path: 'offers',
        loadComponent: () => import('./features/admin/components/offers/offers.component').then(m => m.OffersComponent)
      },
      {
        path: 'faqs',
        loadComponent: () => import('./features/admin/components/faqs/faqs.component').then(m => m.FaqsComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/admin/components/payments/payments.component').then(m => m.PaymentsComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/admin/components/notifications/notifications.component').then(m => m.NotificationsComponent)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
