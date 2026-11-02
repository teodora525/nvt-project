import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserSummary {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  active: boolean;
  createdAt: string;
  maskedCardNumber: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/admin/users';

  constructor(private http: HttpClient) {}

  searchUsers(search?: string, role?: string, active?: boolean | null, page: number = 0, size: number = 10): Observable<Page<UserSummary>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search && search.trim() !== '') {
      params = params.set('search', search.trim());
    }
    if (role && role !== 'ALL') {
      params = params.set('role', role);
    }
    if (active !== null && active !== undefined) {
      params = params.set('active', active.toString());
    }

    return this.http.get<Page<UserSummary>>(this.apiUrl, { params });
  }
}
