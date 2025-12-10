import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-layout.component.html',
  styleUrl: './customer-layout.component.css'
})
export class CustomerLayoutComponent {}

