import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ApiResponse } from '../../../core/models';

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  availableCars: number;
  totalCars: number;
  totalCustomers: number;
  bookedCount: number;
  pendingCount: number;
  cancelledCount: number;
}

export interface AdminCar {
  carId: number;
  carName: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  status: string;
  imgURL?: string;
}

export interface AdminBooking {
  bookingId: number;
  startDate: string;
  endDate: string;
  status: string;
  location: string;
  payment: number;
  customerName: string;
  carModel: string;
  driverStatus: string;
}

export interface AdminCustomer {
  customerId: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export interface AdminStaff {
  staffId: number;
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
}

export interface AdminDriver {
  driverId: number;
  userId: number;
  name: string;
  email: string;
  phoneNumber: string;
  licenseNo: string;
  status: string;
  role: string;
}

export interface AdminOffer {
  offerId: number;
  promoCode: string;
  title: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
}

export interface AdminFaq {
  faqId: number;
  question: string;
  answer: string;
}

export interface AdminPayment {
  paymentId: number;
  bookingId: number;
  bookingStartDate: string;
  bookingEndDate: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  status: string;
}

export interface AdminNotification {
  bookingId: number;
  carName: string;
  driverName: string;
  assignedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private api: ApiService) {}

  getDashboard(): Observable<ApiResponse<DashboardStats>> {
    return this.api.get<DashboardStats>('Admin/dashboard');
  }

  getCars(): Observable<ApiResponse<AdminCar[]>> {
    return this.api.get<AdminCar[]>('Admin/cars');
  }

  createCar(payload: Partial<AdminCar>): Observable<ApiResponse<any>> {
    return this.api.post<any>('Admin/cars', payload);
  }

  updateCar(id: number, payload: Partial<AdminCar>): Observable<ApiResponse<any>> {
    return this.api.put<any>(`Admin/cars/${id}`, payload);
  }

  deleteCar(id: number): Observable<ApiResponse<any>> {
    return this.api.delete<any>(`Admin/cars/${id}`);
  }

  getBookings(): Observable<ApiResponse<AdminBooking[]>> {
    return this.api.get<AdminBooking[]>('Admin/bookings');
  }

  updateBooking(id: number, payload: any): Observable<ApiResponse<any>> {
    return this.api.put<any>(`Admin/bookings/${id}`, payload);
  }

  completeBooking(id: number): Observable<ApiResponse<any>> {
    return this.api.post<any>(`Admin/bookings/${id}/complete`, {});
  }

  getCustomers(): Observable<ApiResponse<AdminCustomer[]>> {
    return this.api.get<AdminCustomer[]>('Admin/customers');
  }

  getStaff(): Observable<ApiResponse<AdminStaff[]>> {
    return this.api.get<AdminStaff[]>('Admin/staff');
  }

  createStaff(payload: any): Observable<ApiResponse<any>> {
    return this.api.post<any>('Admin/staff', payload);
  }

  updateStaff(id: number, payload: any): Observable<ApiResponse<any>> {
    return this.api.put<any>(`Admin/staff/${id}`, payload);
  }

  deleteStaff(id: number): Observable<ApiResponse<any>> {
    return this.api.delete<any>(`Admin/staff/${id}`);
  }

  getDrivers(): Observable<ApiResponse<AdminDriver[]>> {
    return this.api.get<AdminDriver[]>('Admin/drivers');
  }

  createDriver(payload: any): Observable<ApiResponse<any>> {
    return this.api.post<any>('Admin/drivers', payload);
  }

  updateDriver(id: number, payload: any): Observable<ApiResponse<any>> {
    return this.api.put<any>(`Admin/drivers/${id}`, payload);
  }

  deleteDriver(id: number): Observable<ApiResponse<any>> {
    return this.api.delete<any>(`Admin/drivers/${id}`);
  }

  getOffers(): Observable<ApiResponse<AdminOffer[]>> {
    return this.api.get<AdminOffer[]>('Admin/offers');
  }

  createOffer(payload: any): Observable<ApiResponse<any>> {
    return this.api.post<any>('Admin/offers', payload);
  }

  updateOffer(id: number, payload: any): Observable<ApiResponse<any>> {
    return this.api.put<any>(`Admin/offers/${id}`, payload);
  }

  deleteOffer(id: number): Observable<ApiResponse<any>> {
    return this.api.delete<any>(`Admin/offers/${id}`);
  }

  getFaqs(): Observable<ApiResponse<AdminFaq[]>> {
    return this.api.get<AdminFaq[]>('Admin/faqs');
  }

  createFaq(payload: any): Observable<ApiResponse<any>> {
    return this.api.post<any>('Admin/faqs', payload);
  }

  updateFaq(id: number, payload: any): Observable<ApiResponse<any>> {
    return this.api.put<any>(`Admin/faqs/${id}`, payload);
  }

  deleteFaq(id: number): Observable<ApiResponse<any>> {
    return this.api.delete<any>(`Admin/faqs/${id}`);
  }

  getPayments(): Observable<ApiResponse<AdminPayment[]>> {
    return this.api.get<AdminPayment[]>('Admin/payments');
  }

  getNotifications(): Observable<ApiResponse<AdminNotification[]>> {
    return this.api.get<AdminNotification[]>('Admin/notifications');
  }
}

