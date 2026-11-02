import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, UserSummary, Page } from '../../services/user.service';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Upravljanje korisnicima</h1>
          <p class="page-subtitle">Pregled, pretraga i filtriranje svih korisnika na OnlyKicks platformi (serverski filteri)</p>
        </div>
      </div>

      <!-- Filter Controls (Server-side dynamic filtering) -->
      <div class="filter-card">
        <div class="filter-grid">
          <div class="filter-item">
            <label>Tekstualna pretraga (Ime, prezime, email)</label>
            <input
              type="text"
              [(ngModel)]="search"
              (keyup.enter)="applyFilters()"
              placeholder="Unesite pojam za delimično poklapanje..."
              class="form-control"
            />
          </div>

          <div class="filter-item">
            <label>Uloga korisnika</label>
            <select [(ngModel)]="role" (change)="applyFilters()" class="form-control">
              <option value="ALL">Sve uloge</option>
              <option value="ROLE_USER">Kupac (ROLE_USER)</option>
              <option value="ROLE_ADMIN">Administrator (ROLE_ADMIN)</option>
            </select>
          </div>

          <div class="filter-item">
            <label>Status aktivnosti naloga</label>
            <select [(ngModel)]="activeFilter" (change)="applyFilters()" class="form-control">
              <option value="ALL">Svi statusi</option>
              <option value="true">Aktivan nalog</option>
              <option value="false">Neaktivan (čeka aktivaciju)</option>
            </select>
          </div>

          <div class="filter-actions">
            <button (click)="applyFilters()" class="btn-primary">Filtriraj</button>
            <button (click)="resetFilters()" class="btn-secondary">Resetuj</button>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="table-card">
        @if (loading) {
          <div class="table-loading">Učitavanje korisnika...</div>
        } @else if (usersPage && usersPage.content.length > 0) {
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Korisnik</th>
                  <th>Email</th>
                  <th>Uloga</th>
                  <th>Status</th>
                  <th>Platna kartica</th>
                  <th>Registrovan</th>
                </tr>
              </thead>
              <tbody>
                @for (user of usersPage.content; track user.id) {
                  <tr>
                    <td class="user-cell">
                      <img
                        [src]="user.profilePictureUrl || 'https://via.placeholder.com/40'"
                        alt="Avatar"
                        class="table-avatar"
                      />
                      <div>
                        <div class="user-full-name">{{ user.firstName }} {{ user.lastName }}</div>
                        <div class="user-id">ID: #{{ user.id }}</div>
                      </div>
                    </td>
                    <td>{{ user.email }}</td>
                    <td>
                      <span class="badge" [class.badge-admin]="user.role === 'ROLE_ADMIN'" [class.badge-user]="user.role === 'ROLE_USER'">
                        {{ user.role === 'ROLE_ADMIN' ? 'Administrator' : 'Kupac' }}
                      </span>
                    </td>
                    <td>
                      @if (user.active) {
                        <span class="status-active">● Aktivan</span>
                      } @else {
                        <span class="status-inactive">○ Čeka aktivaciju</span>
                      }
                    </td>
                    <td class="card-cell">
                      <code>{{ user.maskedCardNumber }}</code>
                    </td>
                    <td class="date-cell">{{ user.createdAt | date:'dd.MM.yyyy HH:mm' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination-bar">
            <div class="pagination-info">
              Prikazano <strong>{{ usersPage.content.length }}</strong> od ukupno <strong>{{ usersPage.totalElements }}</strong> korisnika
              (Stranica {{ usersPage.number + 1 }} od {{ usersPage.totalPages }})
            </div>

            <div class="pagination-buttons">
              <button
                (click)="changePage(currentPage - 1)"
                [disabled]="usersPage.first"
                class="btn-page"
              >
                Prethodna
              </button>
              <span class="page-number">{{ currentPage + 1 }}</span>
              <button
                (click)="changePage(currentPage + 1)"
                [disabled]="usersPage.last"
                class="btn-page"
              >
                Sledeća
              </button>
            </div>
          </div>
        } @else {
          <div class="table-empty">
            Nema korisnika koji odgovaraju izabranim kriterijumima pretrage.
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1200px;
      margin: 30px auto;
      padding: 0 20px;
    }
    .page-header {
      margin-bottom: 24px;
    }
    .page-title {
      font-size: 26px;
      font-weight: 800;
      color: #111827;
      margin: 0 0 6px 0;
    }
    .page-subtitle {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }
    .filter-card {
      background: #ffffff;
      padding: 20px;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .filter-grid {
      display: grid;
      grid-template-columns: 2fr 1.2fr 1.2fr auto;
      gap: 16px;
      align-items: flex-end;
    }
    @media (max-width: 900px) {
      .filter-grid {
        grid-template-columns: 1fr;
      }
    }
    .filter-item label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .form-control {
      width: 100%;
      box-sizing: border-box;
      padding: 9px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      outline: none;
      background: #ffffff;
    }
    .form-control:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    }
    .filter-actions {
      display: flex;
      gap: 8px;
    }
    .btn-primary {
      background: #2563eb;
      color: white;
      border: none;
      padding: 9px 18px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-primary:hover {
      background: #1d4ed8;
    }
    .btn-secondary {
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      color: #374151;
      padding: 9px 16px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
    }
    .table-card {
      background: #ffffff;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      overflow: hidden;
    }
    .table-responsive {
      overflow-x: auto;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
    }
    .data-table th {
      background: #f9fafb;
      padding: 14px 18px;
      font-weight: 600;
      color: #4b5563;
      border-bottom: 1px solid #e5e7eb;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .data-table td {
      padding: 14px 18px;
      border-bottom: 1px solid #f3f4f6;
      color: #374151;
      vertical-align: middle;
    }
    .user-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .table-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid #e5e7eb;
    }
    .user-full-name {
      font-weight: 600;
      color: #111827;
    }
    .user-id {
      font-size: 11px;
      color: #9ca3af;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .badge-admin {
      background: #fef3c7;
      color: #92400e;
    }
    .badge-user {
      background: #e0f2fe;
      color: #0369a1;
    }
    .status-active {
      color: #059669;
      font-weight: 600;
      font-size: 13px;
    }
    .status-inactive {
      color: #d97706;
      font-weight: 600;
      font-size: 13px;
    }
    .card-cell code {
      background: #f3f4f6;
      padding: 3px 6px;
      border-radius: 4px;
      font-size: 12px;
      color: #4b5563;
    }
    .date-cell {
      color: #6b7280;
      font-size: 13px;
    }
    .table-loading, .table-empty {
      padding: 40px;
      text-align: center;
      color: #6b7280;
      font-size: 15px;
    }
    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }
    .pagination-info {
      font-size: 13px;
      color: #6b7280;
    }
    .pagination-buttons {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .btn-page {
      background: #ffffff;
      border: 1px solid #d1d5db;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
    }
    .btn-page:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .page-number {
      font-weight: 600;
      font-size: 14px;
      color: #111827;
      padding: 0 4px;
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  search = '';
  role = 'ALL';
  activeFilter = 'ALL';

  currentPage = 0;
  pageSize = 10;
  usersPage: Page<UserSummary> | null = null;
  loading = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;

    let activeParam: boolean | null = null;
    if (this.activeFilter === 'true') activeParam = true;
    if (this.activeFilter === 'false') activeParam = false;

    this.userService.searchUsers(
      this.search,
      this.role,
      activeParam,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (page) => {
        this.usersPage = page;
        this.loading = false;
      },
      error: (err) => {
        console.error('Greška pri dobavljanju korisnika:', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadUsers();
  }

  resetFilters(): void {
    this.search = '';
    this.role = 'ALL';
    this.activeFilter = 'ALL';
    this.currentPage = 0;
    this.loadUsers();
  }

  changePage(newPage: number): void {
    this.currentPage = newPage;
    this.loadUsers();
  }
}
