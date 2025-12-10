import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataTableComponent, DataTableColumn } from '../../../../shared/components/data-table/data-table.component';
import { AdminOffer, AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-offers',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ReactiveFormsModule],
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
  success: string | null = null;
  form: FormGroup;
  editingId: number | null = null;

  constructor(private adminService: AdminService, private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      promoCode: ['', Validators.required],
      discountPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['Active', Validators.required],
      description: ['']
    });
  }

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

  startCreate(): void {
    this.editingId = null;
    this.success = null;
    this.error = null;
    this.form.reset({
      title: '',
      promoCode: '',
      discountPercentage: 0,
      startDate: '',
      endDate: '',
      status: 'Active',
      description: ''
    });
  }

  startEdit(offer: AdminOffer): void {
    this.editingId = offer.offerId;
    this.success = null;
    this.error = null;
    this.form.patchValue({
      title: offer.title,
      promoCode: offer.promoCode,
      discountPercentage: offer.discountPercentage,
      startDate: offer.startDate?.slice(0, 10),
      endDate: offer.endDate?.slice(0, 10),
      status: offer.status,
      description: offer.description
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
      ? this.adminService.updateOffer(this.editingId, payload)
      : this.adminService.createOffer(payload);

    request$.subscribe({
      next: (res) => {
        if (res.success) {
          this.success = this.editingId ? 'Offer updated' : 'Offer created';
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

  delete(offer: AdminOffer): void {
    const confirmed = confirm(`Delete offer "${offer.title}"?`);
    if (!confirmed) return;
    this.loading = true;
    this.error = null;
    this.success = null;
    this.adminService.deleteOffer(offer.offerId).subscribe({
      next: (res) => {
        if (res.success) {
          this.success = 'Offer deleted';
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

