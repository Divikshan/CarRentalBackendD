import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  opened = true;
  currentUser: User | null = null;
  currentRoute: string = '';
  notificationCount = 3; // Mock notification count

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.currentRoute = this.router.url;
  }

  ngAfterViewInit(): void {
    // Ensure sidenav is opened after view initialization
    // Use setTimeout to allow Material to fully initialize
    setTimeout(() => {
      if (this.sidenav) {
        if (this.opened && !this.sidenav.opened) {
          this.sidenav.open();
        }
      }
    }, 0);
  }

  toggleSidenav(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
      this.opened = this.sidenav.opened;
    }
  }

  getPageTitle(): string {
    const routeMap: { [key: string]: string } = {
      '/admin/dashboard': 'Dashboard',
      '/admin/cars': 'Cars',
      '/admin/bookings': 'Bookings',
      '/admin/customers': 'Customers',
      '/admin/staff': 'Staff',
      '/admin/drivers': 'Drivers',
      '/admin/offers': 'Offers',
      '/admin/faqs': 'FAQs',
      '/admin/payments': 'Payments',
      '/admin/notifications': 'Notifications'
    };
    return routeMap[this.currentRoute] || 'Admin Panel';
  }

  getBreadcrumbs(): string[] {
    const parts = this.currentRoute.split('/').filter(p => p);
    const breadcrumbs = ['Home'];
    if (parts.length > 0 && parts[0] === 'admin') {
      breadcrumbs.push('Admin');
      if (parts.length > 1) {
        breadcrumbs.push(this.getPageTitle());
      }
    }
    return breadcrumbs;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  goToProfile(): void {
    // Navigate to profile page when implemented
    console.log('Navigate to profile');
  }

  goToSettings(): void {
    // Navigate to settings page when implemented
    console.log('Navigate to settings');
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString();
  }
}

