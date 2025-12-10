import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface DataTableColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent implements OnChanges {
  @Input() title = '';
  @Input() columns: DataTableColumn[] = [];
  @Input() rows: any[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;

  searchTerm = '';
  sortKey: string | null = null;
  sortDir: 'asc' | 'desc' = 'asc';
  page = 1;
  pageSize = 10;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rows']) {
      this.page = 1;
    }
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.page = 1;
  }

  toggleSort(key: string) {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
  }

  changePage(delta: number) {
    const next = this.page + delta;
    const maxPage = Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize));
    this.page = Math.min(Math.max(next, 1), maxPage);
  }

  get filteredRows(): any[] {
    const term = this.searchTerm.trim().toLowerCase();
    let data = this.rows || [];

    if (term) {
      data = data.filter(row =>
        this.columns.some(col => {
          const value = this.getCell(row, col.key);
          return value?.toString().toLowerCase().includes(term);
        })
      );
    }

    if (this.sortKey) {
      data = [...data].sort((a, b) => {
        const aVal = this.getCell(a, this.sortKey!);
        const bVal = this.getCell(b, this.sortKey!);

        if (aVal === undefined || aVal === null) return 1;
        if (bVal === undefined || bVal === null) return -1;

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return this.sortDir === 'asc' ? aVal - bVal : bVal - aVal;
        }

        return this.sortDir === 'asc'
          ? aVal.toString().localeCompare(bVal.toString())
          : bVal.toString().localeCompare(aVal.toString());
      });
    }

    return data;
  }

  get pagedRows(): any[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize));
  }

  getCell(row: any, key: string): any {
    return row ? row[key] : '';
  }
}

