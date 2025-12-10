import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, DashboardStats } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = false;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.adminService.getDashboard().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats = res.data || null;
        } else {
          this.error = res.message || 'Failed to load dashboard';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load dashboard';
        this.loading = false;
      }
    });
  }
}

