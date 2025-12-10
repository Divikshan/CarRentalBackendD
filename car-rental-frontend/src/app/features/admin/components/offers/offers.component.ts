import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataTableComponent, DataTableColumn } from '../../../../shared/components/data-table/data-table.component';
import { AdminOffer, AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-offers',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css'
})
export class OffersComponent implements OnInit {
  columns: DataTableColumn[] = [
    { key: 'offerId', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'promoCode', label: 'Promo Code' },
    { key: 'discountPercentage', label: 'Discount %' },
    { key: 'startDate', label: 'Start' },
    { key: 'endDate', label: 'End' },
    { key: 'status', label: 'Status' }
  ];

  rows: AdminOffer[] = [];
  loading = false;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.adminService.getOffers().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.rows = res.data;
        } else {
          this.error = res.message || 'Failed to load offers';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load offers';
        this.loading = false;
      }
    });
  }
}

