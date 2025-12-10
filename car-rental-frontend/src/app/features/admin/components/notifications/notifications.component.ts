import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataTableComponent, DataTableColumn } from '../../../../shared/components/data-table/data-table.component';
import { AdminNotification, AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  columns: DataTableColumn[] = [
    { key: 'bookingId', label: 'Booking' },
    { key: 'carName', label: 'Car' },
    { key: 'driverName', label: 'Driver' },
    { key: 'assignedAt', label: 'Assigned At' }
  ];

  rows: AdminNotification[] = [];
  loading = false;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.adminService.getNotifications().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.rows = res.data;
        } else {
          this.error = res.message || 'Failed to load notifications';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load notifications';
        this.loading = false;
      }
    });
  }
}

