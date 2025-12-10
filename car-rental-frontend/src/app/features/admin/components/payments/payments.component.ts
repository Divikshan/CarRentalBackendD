import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataTableComponent, DataTableColumn } from '../../../../shared/components/data-table/data-table.component';
import { AdminPayment, AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  columns: DataTableColumn[] = [
    { key: 'paymentId', label: 'ID' },
    { key: 'bookingId', label: 'Booking' },
    { key: 'amount', label: 'Amount' },
    { key: 'paymentMethod', label: 'Method' },
    { key: 'status', label: 'Status' },
    { key: 'paymentDate', label: 'Date' }
  ];

  rows: AdminPayment[] = [];
  loading = false;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.adminService.getPayments().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.rows = res.data;
        } else {
          this.error = res.message || 'Failed to load payments';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load payments';
        this.loading = false;
      }
    });
  }
}

