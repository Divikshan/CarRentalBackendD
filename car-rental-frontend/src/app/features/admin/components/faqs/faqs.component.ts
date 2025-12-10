import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataTableComponent, DataTableColumn } from '../../../../shared/components/data-table/data-table.component';
import { AdminFaq, AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-faqs',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.css'
})
export class FaqsComponent implements OnInit {
  columns: DataTableColumn[] = [
    { key: 'faqId', label: 'ID' },
    { key: 'question', label: 'Question' },
    { key: 'answer', label: 'Answer' }
  ];

  rows: AdminFaq[] = [];
  loading = false;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.adminService.getFaqs().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.rows = res.data;
        } else {
          this.error = res.message || 'Failed to load FAQs';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load FAQs';
        this.loading = false;
      }
    });
  }
}

