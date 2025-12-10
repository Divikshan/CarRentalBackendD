---
name: ""
overview: ""
todos: []
---

# Angular Car Rental Frontend Project Plan

## Overview

Build a modern Angular 19 standalone application with Tailwind CSS that consumes the existing Car Rental Web API backend. The application will support multiple user roles (Customer, Admin, Staff, Driver) with role-based routing and feature access.

## Project Structure

```
car-rental-frontend/
├── src/
│   ├── app/
│   │   ├── core/                    # Core services, guards, interceptors
│   │   │   ├── services/
│   │   │   │   ├── api.service.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── token.service.ts
│   │   │   │   └── storage.service.ts
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   └── error.interceptor.ts
│   │   │   └── models/
│   │   │       ├── user.model.ts
│   │   │       ├── api-response.model.ts
│   │   │       └── index.ts
│   │   ├── features/
│   │   │   ├── auth/                 # Authentication module
│   │   │   │   ├── components/
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── register/
│   │   │   │   │   ├── forgot-password/
│   │   │   │   │   └── verify-email/
│   │   │   │   └── services/
│   │   │   │       └── auth.service.ts
│   │   │   ├── home/                 # Public home page
│   │   │   │   ├── components/
│   │   │   │   │   ├── hero/
│   │   │   │   │   ├── car-list/
│   │   │   │   │   ├── car-details/
│   │   │   │   │   ├── faq/
│   │   │   │   │   └── comparison/
│   │   │   │   └── services/
│   │   │   │       └── home.service.ts
│   │   │   ├── customer/             # Customer features
│   │   │   │   ├── components/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── profile/
│   │   │   │   │   ├── bookings/
│   │   │   │   │   ├── booking-details/
│   │   │   │   │   ├── new-booking/
│   │   │   │   │   ├── payments/
│   │   │   │   │   └── notifications/
│   │   │   │   └── services/
│   │   │   │       └── customer.service.ts
│   │   │   ├── admin/                # Admin features
│   │   │   │   ├── components/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── cars/
│   │   │   │   │   ├── bookings/
│   │   │   │   │   ├── customers/
│   │   │   │   │   ├── staff/
│   │   │   │   │   ├── drivers/
│   │   │   │   │   ├── offers/
│   │   │   │   │   ├── faqs/
│   │   │   │   │   └── payments/
│   │   │   │   └── services/
│   │   │   │       └── admin.service.ts
│   │   │   └── shared/               # Shared components
│   │   │       ├── components/
│   │   │       │   ├── header/
│   │   │       │   ├── footer/
│   │   │       │   ├── sidebar/
│   │   │       │   ├── loading/
│   │   │       │   ├── error-message/
│   │   │       │   └── confirm-dialog/
│   │   │       └── pipes/
│   │   ├── app.config.ts             # App configuration
│   │   ├── app.routes.ts             # Route definitions
│   │   └── app.component.ts          # Root component
│   ├── assets/                       # Static assets
│   ├── environments/                 # Environment configs
│   └── styles/                       # Global styles
│       └── tailwind.css
├── angular.json
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Implementation Steps

### Phase 1: Project Setup & Core Infrastructure

1. **Initialize Angular Project**

   - Create new Angular 19 project with standalone components
   - Configure Tailwind CSS
   - Set up project structure

2. **Core Services & Models**

   - Create `ApiResponse<T>` model matching backend DTOs
   - Implement `ApiService` for HTTP calls with base URL configuration
   - Create `TokenService` for JWT token management
   - Implement `AuthService` for authentication logic
   - Create `StorageService` for localStorage/sessionStorage

3. **Interceptors**

   - `AuthInterceptor`: Add JWT token to requests
   - `ErrorInterceptor`: Handle API errors globally

4. **Guards**

   - `AuthGuard`: Protect authenticated routes
   - `RoleGuard`: Enforce role-based access (Admin, Staff, Customer, Driver)

5. **Environment Configuration**

   - Set up `environment.ts` with API base URL (`http://localhost:5028/api`)

### Phase 2: Authentication Module

1. **Login Component**

   - Form with email/password
   - OTP verification flow
   - JWT token storage
   - Redirect based on user role

2. **Register Component**

   - User registration form
   - Validation
   - Success/error handling

3. **Forgot Password Component**

   - Email verification
   - OTP verification
   - Password change

4. **Auth Service**

   - Login, register, logout methods
   - Token refresh logic
   - User state management

### Phase 3: Public Home Module

1. **Home Page**

   - Hero section
   - Featured cars carousel
   - Quick search

2. **Car Listing Component**

   - Grid/list view toggle
   - Filtering (price, type, availability)
   - Pagination
   - Car card component

3. **Car Details Component**

   - Car information display
   - Image gallery
   - Booking button (redirects to login if not authenticated)

4. **FAQ Component**

   - Accordion-style FAQ display
   - Search functionality

5. **Car Comparison Component**

   - Side-by-side car comparison
   - Feature comparison table

### Phase 4: Customer Module

1. **Customer Dashboard**

   - Profile summary
   - Recent bookings
   - Payment history
   - Quick actions

2. **Profile Management**

   - View/edit profile
   - Change password
   - Profile picture upload (if supported)

3. **Booking Management**

   - List all bookings
   - Booking details view
   - Create new booking
   - Cancel booking
   - Booking status tracking

4. **Payment Management**

   - Payment history
   - Payment details
   - Payment processing (if applicable)

5. **Notifications**

   - Notification list
   - Mark as read
   - Notification count badge

### Phase 5: Admin Module

1. **Admin Dashboard**

   - Statistics cards (total bookings, revenue, cars, customers)
   - Charts/graphs for analytics
   - Recent activity feed

2. **Car Management**

   - CRUD operations for cars
   - Image upload
   - Car status management
   - Bulk operations

3. **Booking Management**

   - View all bookings
   - Update booking status
   - Assign drivers
   - Complete bookings

4. **Customer Management**

   - Customer list with search/filter
   - Customer details view
   - Customer activity history

5. **Staff Management**

   - CRUD operations for staff
   - Role assignment
   - Staff activity tracking

6. **Driver Management**

   - CRUD operations for drivers
   - Driver status management
   - Driver assignment to bookings

7. **Offer Management**

   - Create/edit/delete offers
   - Offer activation/deactivation
   - Offer validity management

8. **FAQ Management**

   - CRUD operations for FAQs
   - FAQ ordering

9. **Payment Management**

   - View all payments
   - Payment reports
   - Cashier operations

10. **Notifications**

    - System notifications
    - Notification management

### Phase 6: Shared Components & UI

1. **Layout Components**

   - Header with navigation
   - Footer
   - Sidebar (for admin/customer dashboards)
   - Responsive navigation menu

2. **UI Components**

   - Loading spinner
   - Error message display
   - Success message toast
   - Confirmation dialog
   - Form inputs with validation
   - Data tables with sorting/pagination
   - Modal dialogs

3. **Pipes**

   - Currency formatting
   - Date formatting
   - Status badge formatting

### Phase 7: Routing & Navigation

1. **Route Configuration**

   - Public routes (home, cars, FAQs)
   - Auth routes (login, register, forgot-password)
   - Customer routes (dashboard, bookings, profile)
   - Admin routes (dashboard, management pages)
   - Staff routes (similar to admin with restrictions)
   - Driver routes (assigned bookings)

2. **Route Guards**

   - Apply guards to protected routes
   - Role-based route access

3. **Navigation**

   - Dynamic navigation based on user role
   - Breadcrumbs
   - Active route highlighting

### Phase 8: State Management (Optional)

1. **State Management Solution**

   - Choose: NgRx, Akita, or simple service-based state
   - Implement for:
     - User authentication state
     - Car listings
     - Booking state
     - Notifications

### Phase 9: Styling & Responsive Design

1. **Tailwind Configuration**

   - Custom color palette
   - Custom spacing/typography
   - Component classes

2. **Responsive Design**

   - Mobile-first approach
   - Tablet layouts
   - Desktop layouts
   - Breakpoint management

3. **Theme Support**

   - Light/dark mode (optional)
   - Consistent design system

### Phase 10: Error Handling & Validation

1. **Form Validation**

   - Reactive forms with validators
   - Custom validators
   - Error message display

2. **API Error Handling**

   - Global error handler
   - User-friendly error messages
   - Retry mechanisms

3. **Loading States**

   - Loading indicators
   - Skeleton screens
   - Optimistic updates

## Technical Specifications

### Dependencies

```json
{
  "dependencies": {
    "@angular/animations": "^19.0.0",
    "@angular/common": "^19.0.0",
    "@angular/forms": "^19.0.0",
    "@angular/router": "^19.0.0",
    "@angular/platform-browser": "^19.0.0",
    "rxjs": "^7.8.0",
    "tailwindcss": "^3.4.0",
    "@angular/cdk": "^19.0.0" // For accessibility features
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^19.0.0",
    "@angular/compiler-cli": "^19.0.0",
    "typescript": "~5.6.0"
  }
}
```

### API Integration Points

- Base URL: `http://localhost:5028/api`
- Authentication: JWT Bearer tokens
- Response Format: `ApiResponse<T>` wrapper
- Error Format: `ApiErrorResponse`

### Key Features

- JWT-based authentication with token refresh
- Role-based access control (Customer, Admin, Staff, Driver)
- Responsive design with Tailwind CSS
- Real-time notifications
- Image upload for cars
- Advanced filtering and search
- Data tables with pagination
- Form validation
- Error handling
- Loading states

## File References

- Backend API Controllers: `CarRentalMoveZ/Controllers/Api/`
- API Response Models: `CarRentalMoveZ/DTOs/ApiResponse.cs`
- ViewModels: `CarRentalMoveZ/ViewModels/`
- JWT Configuration: `CarRentalMoveZ/appsettings.json` (Jwt section)

## Implementation Todos

### Phase 1: Project Setup & Core Infrastructure

- [ ] Initialize Angular 19 project with standalone components
- [ ] Install and configure Tailwind CSS
- [ ] Set up project folder structure
- [ ] Create core models (ApiResponse, User, etc.)
- [ ] Implement ApiService with base URL configuration
- [ ] Create TokenService for JWT management
- [ ] Implement AuthService for authentication
- [ ] Create StorageService for localStorage
- [ ] Implement AuthInterceptor for JWT tokens
- [ ] Implement ErrorInterceptor for global error handling
- [ ] Create AuthGuard for route protection
- [ ] Create RoleGuard for role-based access
- [ ] Configure environment files with API URL

### Phase 2: Authentication Module

- [ ] Create login component with form
- [ ] Implement OTP verification flow
- [ ] Create register component
- [ ] Create forgot-password component
- [ ] Create verify-email component
- [ ] Implement login/logout functionality
- [ ] Add role-based redirect after login
- [ ] Handle token storage and refresh

### Phase 3: Public Home Module

- [ ] Create home page with hero section
- [ ] Implement car listing component with grid/list view
- [ ] Add car filtering and search
- [ ] Create car details component
- [ ] Implement FAQ component with accordion
- [ ] Create car comparison component
- [ ] Add pagination for car listings

### Phase 4: Customer Module

- [ ] Create customer dashboard component
- [ ] Implement profile management (view/edit)
- [ ] Create bookings list component
- [ ] Implement booking details view
- [ ] Create new booking component
- [ ] Add booking cancellation functionality
- [ ] Create payments list component
- [ ] Implement notifications component
- [ ] Add notification count badge

### Phase 5: Admin Module

- [ ] Create admin dashboard with statistics
- [ ] Implement car management CRUD
- [ ] Create booking management interface
- [ ] Implement customer management
- [ ] Create staff management CRUD
- [ ] Implement driver management CRUD
- [ ] Create offer management interface
- [ ] Implement FAQ management
- [ ] Create payment management interface
- [ ] Add cashier operations
- [ ] Implement notification management

### Phase 6: Shared Components & UI

- [ ] Create header component with navigation
- [ ] Create footer component
- [ ] Implement sidebar for dashboards
- [ ] Create loading spinner component
- [ ] Create error message component
- [ ] Implement toast notification service
- [ ] Create confirmation dialog component
- [ ] Build reusable form input components
- [ ] Create data table component with sorting/pagination
- [ ] Implement modal dialog component
- [ ] Create custom pipes (currency, date, status)

### Phase 7: Routing & Navigation

- [ ] Configure public routes
- [ ] Set up authentication routes
- [ ] Configure customer routes with guards
- [ ] Set up admin routes with role guards
- [ ] Configure staff and driver routes
- [ ] Implement dynamic navigation based on role
- [ ] Add breadcrumb navigation
- [ ] Style active route highlighting

### Phase 8: Styling & Responsive Design

- [ ] Configure Tailwind custom theme
- [ ] Implement responsive layouts
- [ ] Add mobile navigation menu
- [ ] Style all components with Tailwind
- [ ] Ensure consistent design system
- [ ] Test responsive breakpoints

### Phase 9: Error Handling & Validation

- [ ] Implement reactive forms with validators
- [ ] Create custom validators
- [ ] Add global error handler
- [ ] Implement user-friendly error messages
- [ ] Add loading states to all async operations
- [ ] Create skeleton loading screens

### Phase 10: Testing & Polish

- [ ] Test authentication flow end-to-end
- [ ] Test all CRUD operations
- [ ] Verify role-based access control
- [ ] Test responsive design on multiple devices
- [ ] Fix any bugs or issues
- [ ] Optimize performance
- [ ] Final integration testing