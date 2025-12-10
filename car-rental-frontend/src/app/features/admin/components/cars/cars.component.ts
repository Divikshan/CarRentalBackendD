import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataTableComponent, DataTableColumn } from '../../../../shared/components/data-table/data-table.component';
import { AdminCar, AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-cars',
  standalone: true,
  imports: [
    CommonModule,
    DataTableComponent,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
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
      imgURL: [''],
      transmission: ['Automatic', Validators.required],
      seats: [5, [Validators.required, Validators.min(1), Validators.max(20)]],
      fuel: ['Gasoline', Validators.required],
      topSpeed: [120, [Validators.required, Validators.min(0), Validators.max(400)]],
      nextOilChange: [''],
      tireReplacement: ['']
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.success = null; // Clear success message when reloading

    this.adminService.getCars().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          // Map backend data (PascalCase) to frontend format (camelCase)
          this.rows = res.data.map((car: any) => ({
            carId: car.CarId || car.carId,
            carName: car.CarName || car.carName,
            brand: car.Brand || car.brand,
            model: car.Model || car.model,
            year: car.Year || car.year,
            pricePerDay: car.PricePerDay || car.pricePerDay,
            status: car.Status || car.status,
            imgURL: car.ImgURL || car.imgURL,
            transmission: car.Transmission || car.transmission,
            seats: car.Seats || car.seats,
            fuel: car.Fuel || car.fuel,
            topSpeed: car.TopSpeed || car.topSpeed,
            nextOilChange: car.NextOilChange || car.nextOilChange,
            tireReplacement: car.TireReplacement || car.tireReplacement
          }));
        } else {
          this.error = res.message || 'Failed to load cars';
          this.rows = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading cars:', err);
        // Extract error message from different possible error structures
        let errorMessage = 'Failed to load cars';
        if (err?.error?.message) {
          errorMessage = err.error.message;
        } else if (err?.message) {
          errorMessage = err.message;
        } else if (err?.error?.errors && Array.isArray(err.error.errors)) {
          errorMessage = err.error.errors.join(', ');
        }

        // Add status code info for debugging
        if (err?.status === 400) {
          errorMessage = 'Bad Request - Please check your authentication or contact support';
        } else if (err?.status === 401) {
          errorMessage = 'Unauthorized - Please login again';
        } else if (err?.status === 403) {
          errorMessage = 'Access denied - You do not have permission to view cars';
        } else if (err?.status === 500) {
          errorMessage = 'Server error - Please try again later';
        }

        this.error = errorMessage;
        this.rows = [];
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
      imgURL: '',
      transmission: 'Automatic',
      seats: 5,
      fuel: 'Gasoline',
      topSpeed: 120,
      nextOilChange: '',
      tireReplacement: ''
    });
  }

  startEdit(car: AdminCar): void {
    this.editingId = car.carId;
    this.success = null;
    this.error = null;

    // Format dates for date inputs (YYYY-MM-DD format)
    let nextOilChangeFormatted = '';
    let tireReplacementFormatted = '';

    if (car.nextOilChange) {
      const oilDate = new Date(car.nextOilChange);
      if (!isNaN(oilDate.getTime())) {
        nextOilChangeFormatted = oilDate.toISOString().split('T')[0];
      }
    }

    if (car.tireReplacement) {
      const tireDate = new Date(car.tireReplacement);
      if (!isNaN(tireDate.getTime())) {
        tireReplacementFormatted = tireDate.toISOString().split('T')[0];
      }
    }

    this.form.patchValue({
      carName: car.carName || '',
      brand: car.brand || '',
      model: car.model || '',
      year: car.year || new Date().getFullYear(),
      pricePerDay: car.pricePerDay || 0,
      status: car.status || 'Available',
      imgURL: car.imgURL || '',
      transmission: car.transmission || 'Automatic',
      seats: car.seats || 5,
      fuel: car.fuel || 'Gasoline',
      topSpeed: car.topSpeed || 120,
      nextOilChange: nextOilChangeFormatted,
      tireReplacement: tireReplacementFormatted
    });

    // Scroll to form section
    setTimeout(() => {
      const formElement = document.querySelector('mat-card');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Please fill in all required fields correctly';
      return;
    }

    this.loading = true;
    this.success = null;
    this.error = null;

    // Map form values to backend expected format (PascalCase to match C# model)
    const payload: any = {
      CarName: this.form.value.carName?.trim(),
      Brand: this.form.value.brand?.trim(),
      Model: this.form.value.model?.trim(),
      Year: Number(this.form.value.year),
      PricePerDay: Number(this.form.value.pricePerDay),
      Status: this.form.value.status,
      ImgURL: this.form.value.imgURL?.trim() || '',
      Transmission: this.form.value.transmission,
      Seats: Number(this.form.value.seats),
      Fuel: this.form.value.fuel,
      TopSpeed: Number(this.form.value.topSpeed)
    };

    // Add optional date fields only if they have values (format as ISO string)
    if (this.form.value.nextOilChange) {
      const oilDate = new Date(this.form.value.nextOilChange);
      payload.NextOilChange = oilDate.toISOString();
    }
    if (this.form.value.tireReplacement) {
      const tireDate = new Date(this.form.value.tireReplacement);
      payload.TireReplacement = tireDate.toISOString();
    }

    const request$ = this.editingId
      ? this.adminService.updateCar(this.editingId, payload)
      : this.adminService.createCar(payload);

    request$.subscribe({
      next: (res) => {
        if (res.success) {
          this.success = this.editingId ? 'Car updated successfully' : 'Car created successfully';
          // Clear form and reset to create mode
          this.startCreate();
          // Auto-hide success message after 5 seconds
          setTimeout(() => {
            this.success = null;
          }, 5000);
          // Reload the car list
          setTimeout(() => {
            this.load();
          }, 500);
        } else {
          // Handle validation errors from backend
          let errorMsg = res.message || 'Operation failed';
          if (res.errors && Array.isArray(res.errors) && res.errors.length > 0) {
            errorMsg = res.errors.join(', ');
          }
          this.error = errorMsg;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error in submit:', err);
        let errorMsg = 'Operation failed';

        // Extract error message from different possible error structures
        if (err?.error?.message) {
          errorMsg = err.error.message;
        } else if (err?.message) {
          errorMsg = err.message;
        }

        // Handle validation errors array
        if (err?.error?.errors && Array.isArray(err.error.errors)) {
          errorMsg = err.error.errors.join(', ');
        }

        // Handle HTTP status codes
        if (err?.status === 400) {
          errorMsg = errorMsg || 'Bad Request - Please check your input data';
        } else if (err?.status === 401) {
          errorMsg = 'Unauthorized - Please login again';
        } else if (err?.status === 403) {
          errorMsg = 'Access denied - You do not have permission';
        } else if (err?.status === 500) {
          errorMsg = 'Server error - Please try again later';
        }

        this.error = errorMsg;
        this.loading = false;
      }
    });
  }

  delete(car: AdminCar): void {
    const confirmed = confirm(`Are you sure you want to delete "${car.carName}"?\n\nThis action cannot be undone.`);
    if (!confirmed) return;

    this.loading = true;
    this.error = null;
    this.success = null;

    this.adminService.deleteCar(car.carId).subscribe({
      next: (res) => {
        if (res.success) {
          this.success = `Car "${car.carName}" deleted successfully`;
          // Auto-hide success message after 5 seconds
          setTimeout(() => {
            this.success = null;
          }, 5000);
          // Clear form if editing this car
          if (this.editingId === car.carId) {
            this.startCreate();
          }
          // Reload the car list
          this.load();
        } else {
          let errorMsg = res.message || 'Delete failed';
          if (res.errors && Array.isArray(res.errors) && res.errors.length > 0) {
            errorMsg = res.errors.join(', ');
          }
          this.error = errorMsg;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error deleting car:', err);
        let errorMsg = 'Delete failed';

        if (err?.error?.message) {
          errorMsg = err.error.message;
        } else if (err?.message) {
          errorMsg = err.message;
        }

        if (err?.error?.errors && Array.isArray(err.error.errors)) {
          errorMsg = err.error.errors.join(', ');
        }

        if (err?.status === 404) {
          errorMsg = 'Car not found';
        } else if (err?.status === 403) {
          errorMsg = 'Access denied - You do not have permission to delete cars';
        } else if (err?.status === 500) {
          errorMsg = 'Server error - Please try again later';
        }

        this.error = errorMsg;
        this.loading = false;
      }
    });
  }
}

