import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataTableComponent, DataTableColumn } from '../../../../shared/components/data-table/data-table.component';
import { AdminBooking, AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css'
})
export class BookingsComponent implements OnInit {
  columns: DataTableColumn[] = [
    { key: 'bookingId', label: 'ID' },
    { key: 'customerName', label: 'Customer' },
    { key: 'carModel', label: 'Car' },
    { key: 'startDate', label: 'Start' },
    { key: 'endDate', label: 'End' },
    { key: 'location', label: 'Location' },
    { key: 'payment', label: 'Payment' },
    { key: 'status', label: 'Status' },
    { key: 'driverStatus', label: 'Driver' }
  ];

  rows: AdminBooking[] = [];
  loading = false;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.adminService.getBookings().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.rows = res.data;
        } else {
          this.error = res.message || 'Failed to load bookings';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load bookings';
        this.loading = false;
      }
    });
  }
}

