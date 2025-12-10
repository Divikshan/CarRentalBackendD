import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataTableComponent, DataTableColumn } from '../../../../shared/components/data-table/data-table.component';
import { AdminCar, AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-cars',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ReactiveFormsModule],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.css'
})
export class CarsComponent implements OnInit {
  columns: DataTableColumn[] = [
    { key: 'carId', label: 'ID' },
    { key: 'carName', label: 'Name' },
    { key: 'brand', label: 'Brand' },
    { key: 'model', label: 'Model' },
    { key: 'year', label: 'Year' },
    { key: 'pricePerDay', label: 'Price/Day' },
    { key: 'status', label: 'Status' }
  ];

  rows: AdminCar[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;

  form: FormGroup;
  editingId: number | null = null;

  constructor(private adminService: AdminService, private fb: FormBuilder) {
    this.form = this.fb.group({
      carName: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: [new Date().getFullYear(), [Validators.required]],
      pricePerDay: [0, [Validators.required, Validators.min(0)]],
      status: ['Available', Validators.required],
      imgURL: ['']
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.adminService.getCars().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.rows = res.data;
        } else {
          this.error = res.message || 'Failed to load cars';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load cars';
        this.loading = false;
      }
    });
  }

  startCreate(): void {
    this.editingId = null;
    this.success = null;
    this.error = null;
    this.form.reset({
      carName: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      pricePerDay: 0,
      status: 'Available',
      imgURL: ''
    });
  }

  startEdit(car: AdminCar): void {
    this.editingId = car.carId;
    this.success = null;
    this.error = null;
    this.form.patchValue({
      carName: car.carName,
      brand: car.brand,
      model: car.model,
      year: car.year,
      pricePerDay: car.pricePerDay,
      status: car.status,
      imgURL: car.imgURL
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
      ? this.adminService.updateCar(this.editingId, payload)
      : this.adminService.createCar(payload);

    request$.subscribe({
      next: (res) => {
        if (res.success) {
          this.success = this.editingId ? 'Car updated' : 'Car created';
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

  delete(car: AdminCar): void {
    const confirmed = confirm(`Delete car "${car.carName}"?`);
    if (!confirmed) return;
    this.loading = true;
    this.error = null;
    this.success = null;
    this.adminService.deleteCar(car.carId).subscribe({
      next: (res) => {
        if (res.success) {
          this.success = 'Car deleted';
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

