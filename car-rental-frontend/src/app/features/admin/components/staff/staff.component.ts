import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataTableComponent, DataTableColumn } from '../../../../shared/components/data-table/data-table.component';
import { AdminService, AdminStaff } from '../../services/admin.service';

@Component({
  selector: 'app-admin-staff',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ReactiveFormsModule],
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
  success: string | null = null;
  form: FormGroup;
  editingId: number | null = null;

  constructor(private adminService: AdminService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['Staff', Validators.required],
      phoneNumber: ['', Validators.required]
    });
  }

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

  startCreate(): void {
    this.editingId = null;
    this.success = null;
    this.error = null;
    this.form.reset({
      name: '',
      email: '',
      role: 'Staff',
      phoneNumber: ''
    });
  }

  startEdit(staff: AdminStaff): void {
    this.editingId = staff.staffId;
    this.success = null;
    this.error = null;
    this.form.patchValue({
      name: staff.name,
      email: staff.email,
      role: staff.role,
      phoneNumber: staff.phoneNumber
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
      ? this.adminService.updateStaff(this.editingId, payload)
      : this.adminService.createStaff(payload);

    request$.subscribe({
      next: (res) => {
        if (res.success) {
          this.success = this.editingId ? 'Staff updated' : 'Staff created';
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

  delete(staff: AdminStaff): void {
    const confirmed = confirm(`Delete staff "${staff.name}"?`);
    if (!confirmed) return;
    this.loading = true;
    this.error = null;
    this.success = null;
    this.adminService.deleteStaff(staff.staffId).subscribe({
      next: (res) => {
        if (res.success) {
          this.success = 'Staff deleted';
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

