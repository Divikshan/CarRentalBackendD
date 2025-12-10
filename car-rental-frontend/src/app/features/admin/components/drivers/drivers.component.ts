import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataTableComponent, DataTableColumn } from '../../../../shared/components/data-table/data-table.component';
import { AdminDriver, AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-drivers',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.css'
})
export class DriversComponent implements OnInit {
  columns: DataTableColumn[] = [
    { key: 'driverId', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'licenseNo', label: 'License' },
    { key: 'status', label: 'Status' }
  ];

  rows: AdminDriver[] = [];
  loading = false;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.adminService.getDrivers().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.rows = res.data;
        } else {
          this.error = res.message || 'Failed to load drivers';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load drivers';
        this.loading = false;
      }
    });
  }
}

