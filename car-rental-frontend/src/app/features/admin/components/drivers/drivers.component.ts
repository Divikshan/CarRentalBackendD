import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataTableComponent, DataTableColumn } from '../../../../shared/components/data-table/data-table.component';
import { AdminDriver, AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-drivers',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ReactiveFormsModule],
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
  success: string | null = null;
  form: FormGroup;
  editingId: number | null = null;

  constructor(private adminService: AdminService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      licenseNo: ['', Validators.required],
      status: ['Active', Validators.required],
      role: ['Driver']
    });
  }

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

  startCreate(): void {
    this.editingId = null;
    this.success = null;
    this.error = null;
    this.form.reset({
      name: '',
      email: '',
      phoneNumber: '',
      licenseNo: '',
      status: 'Active',
      role: 'Driver'
    });
  }

  startEdit(driver: AdminDriver): void {
    this.editingId = driver.driverId;
    this.success = null;
    this.error = null;
    this.form.patchValue({
      name: driver.name,
      email: driver.email,
      phoneNumber: driver.phoneNumber,
      licenseNo: driver.licenseNo,
      status: driver.status,
      role: driver.role
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.success = null;
    this.error = null;

    const payload = this.form.value;
    const request$ = this.editingId
      ? this.adminService.updateDriver(this.editingId, payload)
      : this.adminService.createDriver(payload);

    request$.subscribe({
      next: (res) => {
        if (res.success) {
          this.success = this.editingId ? 'Driver updated' : 'Driver created';
          this.startCreate();
          this.load();
        } else {
          this.error = res.message || 'Operation failed';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Operation failed';
        this.loading = false;
      }
    });
  }

  delete(driver: AdminDriver): void {
    const confirmed = confirm(`Delete driver "${driver.name}"?`);
    if (!confirmed) return;
    this.loading = true;
    this.error = null;
    this.success = null;
    this.adminService.deleteDriver(driver.driverId).subscribe({
      next: (res) => {
        if (res.success) {
          this.success = 'Driver deleted';
          this.load();
        } else {
          this.error = res.message || 'Delete failed';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Delete failed';
        this.loading = false;
      }
    });
  }
}

