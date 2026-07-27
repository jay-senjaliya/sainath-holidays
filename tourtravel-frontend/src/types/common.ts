// Generic Spring Data page wrapper — matches org.springframework.data.domain.Page's
// JSON shape, returned by every paginated admin endpoint.
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page index, 0-based
  size: number;
  first: boolean;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
