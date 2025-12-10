import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataTableComponent, DataTableColumn } from '../../../../shared/components/data-table/data-table.component';
import { AdminCar, AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-cars',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
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

  constructor(private adminService: AdminService) {}

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
}

