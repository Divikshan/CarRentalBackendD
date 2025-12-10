import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-layout.component.html',
  styleUrl: './customer-layout.component.css'
})
export class CustomerLayoutComponent {
  constructor(private router: Router) {}

  onNavigationChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target && target.value) {
      this.router.navigate([target.value]);
    }
  }
}

