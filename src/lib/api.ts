import axios from 'axios';

export const API_BASE_URL = 'https://campusshelf.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT authentication header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('unilib_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle unauthenticated sessions (401 errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('unilib_token');
      localStorage.removeItem('unilib_isLoggedIn');
      localStorage.removeItem('unilib_role');
      if (window.location.pathname !== '/login') {
        // Force redirect to login if session has expired or token is invalid
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/* ==========================================
   TYPE DECLARATIONS (DTOs)
   ========================================== */

export interface HealthResponseDto {
  service: string;
  status: string;
  timestamp: string;
}

// Auth DTOs
export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  departmentId: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface AuthResponseDto {
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Student' | 'Staff' | 'Admin';
}

export interface ForgotPasswordDto {
  email: string;
}

export interface VerifyOtpDto {
  email: string;
  otpCode: string;
}

export interface ResetPasswordDto {
  email: string;
  otpCode: string;
  newPassword?: string;
}

export interface ChangePasswordDto {
  currentPassword?: string;
  newPassword?: string;
}

// Borrow Request DTOs
export interface BorrowRequestDto {
  id: string;
  itemTitle: string;
  requestedByName: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Returned';
  dueDate: string;
  returnedAt: string | null;
  quantityRequested: number;
  fineAmount: number;
  finePaid: boolean;
  renewalCount: number;
  maxRenewals: number;
}

export interface CreateBorrowRequestDto {
  libraryItemId: string;
  quantityRequested: number;
  dueDate: string;
  notes?: string;
}

// Category DTOs
export interface CategoryDto {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  parentName: string | null;
  itemCount: number;
}

export interface CategoryTreeDto {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  subCategories: CategoryTreeDto[];
}

export interface CreateCategoryDto {
  name: string;
  description: string;
  parentId?: string | null;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  parentId?: string | null;
}

// Department DTOs
export interface DepartmentDto {
  id: string;
  code: string;
  name: string;
  memberCount: number;
}

export interface CreateDepartmentDto {
  code: string;
  name: string;
}

export interface UpdateDepartmentDto {
  code?: string;
  name?: string;
}

// User DTOs
export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Student' | 'Staff' | 'Admin';
  departmentName: string;
  phoneNumber?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  departmentId?: string;
  phoneNumber?: string;
}

export interface UserBorrowingHistoryDto {
  userId: string;
  firstName: string;
  lastName: string;
  totalBorrowed: number;
  currentlyBorrowed: number;
  totalFines: number;
  unpaidFines: number;
  history: BorrowRequestDto[];
}

// Library Item DTOs
export interface LibraryItemDto {
  id: string;
  title: string;
  description?: string;
  author: string;
  publisher: string;
  isbn: string | null;
  publicationYear: number | null;
  edition: string | null;
  type: string;
  status: string;
  totalCopies: number;
  availableCopies: number;
  categoryName: string;
  shelfName: string;
}

export interface CreateLibraryItemDto {
  title: string;
  description: string;
  author: string;
  publisher: string;
  isbn?: string | null;
  publicationYear?: number | null;
  edition?: string | null;
  totalCopies: number;
  lowStockThreshold?: number;
  type?: string;
  categoryId: string;
  shelfId: string;
}

export interface UpdateLibraryItemDto {
  title?: string;
  description?: string;
  author?: string;
  publisher?: string;
  isbn?: string | null;
  publicationYear?: number | null;
  edition?: string | null;
  totalCopies?: number;
  lowStockThreshold?: number;
  type?: string;
  categoryId?: string;
  shelfId?: string;
}

export interface NaturalLanguageSearchRequestDto {
  query: string;
  maxResults?: number;
}

export interface NaturalLanguageSearchResponseDto {
  query: string;
  interpretedQuery: string;
  usedNaturalLanguage: boolean;
  usedFallback: boolean;
  fallbackReason: string;
  totalMatches: number;
  results: Array<{
    item: LibraryItemDto;
    reason: string;
    relevanceScore: number;
  }>;
}

// Recommendations
export interface RecommendationDto {
  item: LibraryItemDto;
  reason: string;
  relevanceScore: number;
}

export interface RecommendationResponseDto {
  recommendations: RecommendationDto[];
  readerProfile: string;
  isPersonalised: boolean;
}

// Reservations
export interface ReservationDto {
  id: string;
  itemTitle: string;
  userName: string;
  reservedAt: string;
  expiresAt: string;
  isActive: boolean;
}

// Chat DTOs
export interface ChatMessageDto {
  message: string;
}

export interface ChatResponseDto {
  userMessage: string;
  assistantResponse: string;
  createdAt: string;
}

export interface ChatHistoryDto {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

// Reviews DTOs
export interface ReviewDto {
  id: string;
  libraryItemId: string;
  rating: number;
  comment: string | null;
  isEdited: boolean;
  userName: string;
  userId: string;
  itemTitle: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemReviewSummaryDto {
  libraryItemId: string;
  itemTitle: string;
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: Record<string, number>;
  reviews: ReviewDto[];
}

export interface CreateReviewDto {
  libraryItemId: string;
  rating: number;
  comment?: string | null;
}

export interface UpdateReviewDto {
  rating: number;
  comment?: string | null;
}

// Analytics DTOs
export interface DashboardDto {
  overview: {
    totalItems: number;
    totalUsers: number;
    totalBorrowRequests: number;
    activeLoans: number;
    overdueLoans: number;
    pendingRequests: number;
    activeReservations: number;
    totalFinesCollected: number;
    totalFinesOutstanding: number;
    itemsBorrowedThisMonth: number;
    newUsersThisMonth: number;
    lowStockItems: number;
  };
  mostBorrowedItems: Array<{
    libraryItemId: string;
    title: string;
    author: string;
    categoryName: string;
    borrowCount: number;
    availableCopies: number;
    totalCopies: number;
  }>;
  borrowingTrends: Array<{
    year: number;
    month: number;
    monthName: string;
    borrowCount: number;
    returnCount: number;
    newUsers: number;
  }>;
  categoryUsage: Array<{
    categoryId: string;
    categoryName: string;
    parentCategoryName: string | null;
    borrowCount: number;
    itemCount: number;
    usagePercentage: number;
  }>;
  fineAnalytics: {
    totalFinesEver: number;
    totalCollected: number;
    totalOutstanding: number;
    usersWithOutstandingFines: number;
    averageFinePerOverdueReturn: number;
    monthlyBreakdown: Array<{
      year: number;
      month: number;
      monthName: string;
      finesGenerated: number;
      finesCollected: number;
    }>;
  };
}

export interface OverviewDto {
  totalItems: number;
  totalUsers: number;
  totalBorrowRequests: number;
  activeLoans: number;
}

export interface MostBorrowedItemDto {
  libraryItemId: string;
  title: string;
  author: string;
  borrowCount: number;
}

export interface BorrowingTrendDto {
  year: number;
  month: number;
  monthName: string;
  borrowCount: number;
}

export interface CategoryUsageDto {
  categoryId: string;
  categoryName: string;
  borrowCount: number;
}

export interface FineAnalyticsDto {
  totalFinesEver: number;
  totalCollected: number;
  totalOutstanding: number;
}

// Digital Resource DTOs
export interface DigitalResourceDto {
  id: string;
  title: string;
  description: string;
  resourceType: string;
  fileUrl: string;
  fileSizeBytes: number;
  originalFileName: string;
  isPublic: boolean;
  uploadedByName: string;
  linkedItemTitle: string | null;
  createdAt: string;
}

// Payments DTOs
export interface InitializePaymentDto {
  borrowRequestIds: string[];
}

export interface InitializePaymentResponseDto {
  authorizationUrl?: string;
  reference: string;
  message?: string;
}

/* ==========================================
   API ENDPOINTS
   ========================================== */

export const healthApi = {
  check: () => api.get<HealthResponseDto>('/health').then((r) => r.data),
};

export const authApi = {
  register: (data: RegisterDto) => api.post<AuthResponseDto>('/auth/register', data).then((r) => r.data),
  login: (data: LoginDto) => api.post<AuthResponseDto>('/auth/login', data).then((r) => r.data),
  forgotPassword: (data: ForgotPasswordDto) => api.post<{ message: string }>('/auth/forgot-password', data).then((r) => r.data),
  verifyOtp: (data: VerifyOtpDto) => api.post<{ message: string }>('/auth/verify-otp', data).then((r) => r.data),
  resetPassword: (data: ResetPasswordDto) => api.post<{ message: string }>('/auth/reset-password', data).then((r) => r.data),
  changePassword: (data: ChangePasswordDto) => api.post<{ message: string }>('/auth/change-password', data).then((r) => r.data),
};

export const borrowRequestApi = {
  getAll: () => api.get<BorrowRequestDto[]>('/borrowrequests').then((r) => r.data),
  getMine: () => api.get<BorrowRequestDto[]>('/borrowrequests/my').then((r) => r.data),
  create: (data: CreateBorrowRequestDto) => api.post<BorrowRequestDto>('/borrowrequests', data).then((r) => r.data),
  approve: (id: string) => api.patch<BorrowRequestDto>(`/borrowrequests/${id}/approve`).then((r) => r.data),
  reject: (id: string) => api.patch<BorrowRequestDto>(`/borrowrequests/${id}/reject`).then((r) => r.data),
  markReturned: (id: string) => api.patch<BorrowRequestDto>(`/borrowrequests/${id}/return`).then((r) => r.data),
  renew: (id: string) => api.patch<BorrowRequestDto>(`/borrowrequests/${id}/renew`).then((r) => r.data),
};

export const categoryApi = {
  getCategories: (params?: { view?: string; parentId?: string; id?: string }) =>
    api.get<any>('/categories', { params }).then((r) => r.data),
  getSubcategories: (id: string) => api.get<CategoryDto[]>(`/categories/${id}/subcategories`).then((r) => r.data),
  create: (data: CreateCategoryDto) => api.post<CategoryDto>('/categories', data).then((r) => r.data),
  update: (id: string, data: UpdateCategoryDto) => api.put<CategoryDto>(`/categories/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete<void>(`/categories/${id}`).then((r) => r.data),
};

export const departmentApi = {
  getAll: () => api.get<DepartmentDto[]>('/departments').then((r) => r.data),
  getById: (id: string) => api.get<DepartmentDto>(`/departments/${id}`).then((r) => r.data),
  create: (data: CreateDepartmentDto) => api.post<DepartmentDto>('/departments', data).then((r) => r.data),
  update: (id: string, data: UpdateDepartmentDto) => api.put<DepartmentDto>(`/departments/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete<void>(`/departments/${id}`).then((r) => r.data),
};

export const recommendationApi = {
  get: () => api.get<RecommendationResponseDto>('/recommendations').then((r) => r.data),
};

export const reservationApi = {
  getAll: () => api.get<ReservationDto[]>('/reservations').then((r) => r.data),
  getMine: () => api.get<ReservationDto[]>('/reservations/my').then((r) => r.data),
  create: (libraryItemId: string) => api.post<ReservationDto>(`/reservations/${libraryItemId}`).then((r) => r.data),
  cancel: (id: string) => api.delete<void>(`/reservations/${id}`).then((r) => r.data),
};

export const userApi = {
  getAll: () => api.get<UserDto[]>('/users').then((r) => r.data),
  getById: (id: string) => api.get<UserDto>(`/users/${id}`).then((r) => r.data),
  getMe: () => api.get<UserDto>('/users/me').then((r) => r.data),
  updateMe: (data: UpdateUserDto) => api.put<UserDto>('/users/me', data).then((r) => r.data),
  updateRole: (id: string, role: string) => api.patch<void>(`/users/${id}/role`, JSON.stringify(role), {
    headers: { 'Content-Type': 'application/json' }
  }).then((r) => r.data),
  getHistory: (id: string) => api.get<UserBorrowingHistoryDto>(`/users/${id}/history`).then((r) => r.data),
  getMyHistory: () => api.get<UserBorrowingHistoryDto>('/users/me/history').then((r) => r.data),
  delete: (id: string) => api.delete<void>(`/users/${id}`).then((r) => r.data),
};

export const libraryItemApi = {
  getAll: () => api.get<LibraryItemDto[]>('/libraryitems').then((r) => r.data),
  getById: (id: string) => api.get<LibraryItemDto>(`/libraryitems/${id}`).then((r) => r.data),
  search: (query: string) => api.get<LibraryItemDto[]>('/libraryitems/search', { params: { query } }).then((r) => r.data),
  naturalSearch: (data: NaturalLanguageSearchRequestDto) => api.post<NaturalLanguageSearchResponseDto>('/libraryitems/natural-search', data).then((r) => r.data),
  getByCategory: (categoryId: string) => api.get<LibraryItemDto[]>(`/libraryitems/category/${categoryId}`).then((r) => r.data),
  getLowStock: () => api.get<LibraryItemDto[]>('/libraryitems/low-stock').then((r) => r.data),
  create: (data: CreateLibraryItemDto) => api.post<LibraryItemDto>('/libraryitems', data).then((r) => r.data),
  update: (id: string, data: UpdateLibraryItemDto) => api.put<LibraryItemDto>(`/libraryitems/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete<void>(`/libraryitems/${id}`).then((r) => r.data),
};

export const chatApi = {
  sendMessage: (data: ChatMessageDto) => api.post<ChatResponseDto>('/chat', data).then((r) => r.data),
  getHistory: () => api.get<ChatHistoryDto[]>('/chat/history').then((r) => r.data),
  clearHistory: () => api.delete<void>('/chat/history').then((r) => r.data),
};

export const reviewsApi = {
  getByItem: (libraryItemId: string) => api.get<ItemReviewSummaryDto>(`/reviews/item/${libraryItemId}`).then((r) => r.data),
  getByUser: (userId: string) => api.get<ReviewDto[]>(`/reviews/user/${userId}`).then((r) => r.data),
  getMine: () => api.get<ReviewDto[]>('/reviews/my').then((r) => r.data),
  getMyReviewForItem: (libraryItemId: string) => api.get<ReviewDto | null>(`/reviews/my/item/${libraryItemId}`).then((r) => r.data),
  create: (data: CreateReviewDto) => api.post<ReviewDto>('/reviews', data).then((r) => r.data),
  update: (id: string, data: UpdateReviewDto) => api.put<ReviewDto>(`/reviews/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete<void>(`/reviews/${id}`).then((r) => r.data),
};

export const analyticsApi = {
  getDashboard: () => api.get<DashboardDto>('/analytics/dashboard').then((r) => r.data),
  getOverview: () => api.get<OverviewDto>('/analytics/overview').then((r) => r.data),
  getMostBorrowed: (top = 10) => api.get<MostBorrowedItemDto[]>('/analytics/most-borrowed', { params: { top } }).then((r) => r.data),
  getBorrowingTrends: (months = 12) => api.get<BorrowingTrendDto[]>('/analytics/borrowing-trends', { params: { months } }).then((r) => r.data),
  getCategoryUsage: () => api.get<CategoryUsageDto[]>('/analytics/category-usage').then((r) => r.data),
  getFines: () => api.get<FineAnalyticsDto>('/analytics/fines').then((r) => r.data),
};

export const digitalResourcesApi = {
  getAll: () => api.get<DigitalResourceDto[]>('/digitalresources').then((r) => r.data),
  getPublic: () => api.get<DigitalResourceDto[]>('/digitalresources/public').then((r) => r.data),
  getById: (id: string) => api.get<DigitalResourceDto>(`/digitalresources/${id}`).then((r) => r.data),
  getByLibraryItem: (libraryItemId: string) => api.get<DigitalResourceDto[]>(`/digitalresources/library-item/${libraryItemId}`).then((r) => r.data),
  upload: (formData: FormData) => api.post<DigitalResourceDto>('/digitalresources', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then((r) => r.data),
  delete: (id: string) => api.delete<void>(`/digitalresources/${id}`).then((r) => r.data),
};

export const paymentApi = {
  initialize: (data: InitializePaymentDto) => api.post<InitializePaymentResponseDto>('/payments/initialize', data).then((r) => r.data),
};
