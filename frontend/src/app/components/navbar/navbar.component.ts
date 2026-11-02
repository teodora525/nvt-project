import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="nav-container">
        <a routerLink="/" class="logo">
          <span class="logo-accent">⚡ Only</span>Kicks
        </a>

        <nav class="nav-links">
          @if (!auth.isLoggedIn()) {
            <a routerLink="/login" routerLinkActive="active" class="nav-item">Prijava</a>
            <a routerLink="/register" routerLinkActive="active" class="btn-primary">Registracija</a>
          } @else {
            @if (auth.isAdmin()) {
              <a routerLink="/admin/users" routerLinkActive="active" class="nav-item">
                👥 Pretraga Korisnika
              </a>
            }

            <div class="user-profile">
              @if (auth.currentUser()?.profilePictureUrl) {
                <img [src]="auth.currentUser()?.profilePictureUrl" alt="Avatar" class="avatar" />
              }
              <span class="user-name">{{ auth.currentUser()?.firstName }} ({{ auth.currentUser()?.role === 'ROLE_ADMIN' ? 'Admin' : 'Kupac' }})</span>
              <button (click)="logout()" class="btn-secondary">Odjavi se</button>
            </div>
          }
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo {
      font-size: 22px;
      font-weight: 800;
      color: #111827;
      text-decoration: none;
      letter-spacing: -0.5px;
    }
    .logo-accent {
      color: #2563eb;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .nav-item {
      text-decoration: none;
      color: #4b5563;
      font-weight: 500;
      font-size: 15px;
      transition: color 0.2s;
    }
    .nav-item:hover, .nav-item.active {
      color: #2563eb;
    }
    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #e5e7eb;
    }
    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }
    .btn-primary {
      background: #2563eb;
      color: white;
      padding: 8px 18px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      transition: background 0.2s;
    }
    .btn-primary:hover {
      background: #1d4ed8;
    }
    .btn-secondary {
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      color: #374151;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s;
    }
    .btn-secondary:hover {
      background: #e5e7eb;
    }
  `]
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
