import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataTableComponent, DataTableColumn } from '../../../../shared/components/data-table/data-table.component';
import { AdminFaq, AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-faqs',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ReactiveFormsModule],
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
  success: string | null = null;
  form: FormGroup;
  editingId: number | null = null;

  constructor(private adminService: AdminService, private fb: FormBuilder) {
    this.form = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required]
    });
  }

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

  startCreate(): void {
    this.editingId = null;
    this.success = null;
    this.error = null;
    this.form.reset({
      question: '',
      answer: ''
    });
  }

  startEdit(faq: AdminFaq): void {
    this.editingId = faq.faqId;
    this.success = null;
    this.error = null;
    this.form.patchValue({
      question: faq.question,
      answer: faq.answer
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
      ? this.adminService.updateFaq(this.editingId, payload)
      : this.adminService.createFaq(payload);

    request$.subscribe({
      next: (res) => {
        if (res.success) {
          this.success = this.editingId ? 'FAQ updated' : 'FAQ created';
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

  delete(faq: AdminFaq): void {
    const confirmed = confirm(`Delete FAQ "${faq.question}"?`);
    if (!confirmed) return;
    this.loading = true;
    this.error = null;
    this.success = null;
    this.adminService.deleteFaq(faq.faqId).subscribe({
      next: (res) => {
        if (res.success) {
          this.success = 'FAQ deleted';
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

