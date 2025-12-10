export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface ApiResponseNonGeneric {
  success: boolean;
  data?: any;
  message?: string;
  errors?: string[];
}

