import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataTableComponent, DataTableColumn } from '../../../../shared/components/data-table/data-table.component';
import { AdminService, AdminStaff } from '../../services/admin.service';

@Component({
  selector: 'app-admin-staff',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent implements OnInit {
  columns: DataTableColumn[] = [
    { key: 'staffId', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'phoneNumber', label: 'Phone' }
  ];

  rows: AdminStaff[] = [];
  loading = false;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.adminService.getStaff().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.rows = res.data;
        } else {
          this.error = res.message || 'Failed to load staff';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load staff';
        this.loading = false;
      }
    });
  }
}

