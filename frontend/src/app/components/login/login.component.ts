import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <h2 class="auth-title">Prijava na OnlyKicks</h2>
        <p class="auth-subtitle">Unesite svoje podatke za pristup nalogu</p>

        @if (errorMessage) {
          <div class="alert-error">{{ errorMessage }}</div>
        }

        <form (ngSubmit)="onLogin()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email adresa</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              class="form-control"
              placeholder="npr. petar@example.com"
            />
          </div>

          <div class="form-group">
            <label for="password">Lozinka</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              class="form-control"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" [disabled]="loading || !loginForm.form.valid" class="btn-submit">
            @if (loading) {
              Prijavljivanje...
            } @else {
              Prijavi se
            }
          </button>
        </form>

        <p class="auth-footer">
          Nemate nalog? <a routerLink="/register">Registrujte se ovde</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: calc(100vh - 70px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      background: #f9fafb;
    }
    .auth-card {
      background: #ffffff;
      width: 100%;
      max-width: 440px;
      padding: 36px;
      border-radius: 12px;
      box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
      border: 1px solid #e5e7eb;
    }
    .auth-title {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 8px 0;
    }
    .auth-subtitle {
      font-size: 14px;
      color: #6b7280;
      margin: 0 0 24px 0;
    }
    .alert-error {
      background: #fee2e2;
      border: 1px solid #f87171;
      color: #b91c1c;
      padding: 12px;
      border-radius: 6px;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .form-group {
      margin-bottom: 18px;
    }
    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 6px;
    }
    .form-control {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 14px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    .form-control:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    }
    .btn-submit {
      width: 100%;
      padding: 12px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 10px;
    }
    .btn-submit:hover:not(:disabled) {
      background: #1d4ed8;
    }
    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .auth-footer {
      text-align: center;
      margin-top: 24px;
      font-size: 14px;
      color: #6b7280;
    }
    .auth-footer a {
      color: #2563eb;
      font-weight: 600;
      text-decoration: none;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.errorMessage = '';
    this.loading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (user) => {
        this.loading = false;
        if (user.role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin/users']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.error || 'Neuspešna prijava. Proverite podatke ili aktivirajte nalog.';
      }
    });
  }
}
