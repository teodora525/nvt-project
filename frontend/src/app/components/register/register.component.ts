import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <h2 class="auth-title">Kreirajte nalog</h2>
        <p class="auth-subtitle">Pridružite se OnlyKicks platformi za patike</p>

        @if (successMessage) {
          <div class="alert-success">
            <strong>✓ Uspešno!</strong> {{ successMessage }}
            <div class="mailpit-hint">
              📩 Dev alat: Proverite pristigle mejlove na <a href="http://localhost:8025" target="_blank">Mailpit (port 8025)</a>
            </div>
          </div>
        }

        @if (errorMessage) {
          <div class="alert-error">{{ errorMessage }}</div>
        }

        @if (!successMessage) {
          <form (ngSubmit)="onRegister()" #regForm="ngForm">
            <div class="form-row">
              <div class="form-group half">
                <label for="firstName">Ime *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  [(ngModel)]="formData.firstName"
                  required
                  class="form-control"
                  placeholder="Petar"
                />
              </div>

              <div class="form-group half">
                <label for="lastName">Prezime *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  [(ngModel)]="formData.lastName"
                  required
                  class="form-control"
                  placeholder="Petrović"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email adresa *</label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="formData.email"
                required
                class="form-control"
                placeholder="petar@example.com"
              />
            </div>

            <div class="form-group">
              <label for="password">Lozinka (min. 6 karaktera) *</label>
              <input
                type="password"
                id="password"
                name="password"
                [(ngModel)]="formData.password"
                required
                minlength="6"
                class="form-control"
                placeholder="••••••••"
              />
            </div>

            <!-- Profile Picture Upload directly to MinIO -->
            <div class="form-group">
              <label>Profilna slika * <span class="note">(Upload direktno na MinIO BLOB storage)</span></label>
              <input
                type="file"
                (change)="onFileSelected($event)"
                accept="image/*"
                required
                class="form-control file-input"
              />

              @if (uploadingImage) {
                <p class="upload-status">⏳ Slanje slike na MinIO storage...</p>
              }

              @if (formData.profilePictureUrl) {
                <div class="image-preview">
                  <img [src]="formData.profilePictureUrl" alt="Preview" />
                  <span class="preview-ok">✓ Slika uspešno okačena na MinIO</span>
                </div>
              }
            </div>

            <hr class="section-divider" />
            <h4 class="section-heading">Podaci o platnoj kartici</h4>

            <div class="form-group">
              <label for="cardNumber">Broj kartice *</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                [(ngModel)]="formData.cardNumber"
                required
                maxlength="19"
                class="form-control"
                placeholder="4111222233334444"
              />
            </div>

            <div class="form-group">
              <label for="cardHolder">Ime vlasnika kartice *</label>
              <input
                type="text"
                id="cardHolder"
                name="cardHolder"
                [(ngModel)]="formData.cardHolder"
                required
                class="form-control"
                placeholder="PETAR PETROVIC"
              />
            </div>

            <div class="form-row">
              <div class="form-group half">
                <label for="expirationDate">Istek (MM/YY) *</label>
                <input
                  type="text"
                  id="expirationDate"
                  name="expirationDate"
                  [(ngModel)]="formData.expirationDate"
                  required
                  placeholder="12/28"
                  maxlength="5"
                  class="form-control"
                />
              </div>

              <div class="form-group half">
                <label for="cvv">CVV *</label>
                <input
                  type="password"
                  id="cvv"
                  name="cvv"
                  [(ngModel)]="formData.cvv"
                  required
                  maxlength="4"
                  placeholder="123"
                  class="form-control"
                />
              </div>
            </div>

            <button
              type="submit"
              [disabled]="loading || uploadingImage || !formData.profilePictureUrl || !regForm.form.valid"
              class="btn-submit"
            >
              @if (loading) {
                Registracija u toku...
              } @else {
                Registruj se
              }
            </button>
          </form>
        }

        <p class="auth-footer">
          Već imate nalog? <a routerLink="/login">Prijavite se</a>
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
      max-width: 500px;
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
      margin: 0 0 20px 0;
    }
    .alert-success {
      background: #ecfdf5;
      border: 1px solid #34d399;
      color: #065f46;
      padding: 16px;
      border-radius: 6px;
      margin-bottom: 20px;
      font-size: 14px;
      line-height: 1.5;
    }
    .mailpit-hint {
      margin-top: 10px;
      font-size: 13px;
    }
    .mailpit-hint a {
      color: #047857;
      font-weight: bold;
      text-decoration: underline;
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
    .form-row {
      display: flex;
      gap: 12px;
    }
    .half {
      flex: 1;
    }
    .form-group {
      margin-bottom: 16px;
    }
    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 6px;
    }
    .note {
      font-weight: normal;
      color: #6b7280;
      font-size: 12px;
    }
    .form-control {
      width: 100%;
      box-sizing: border-box;
      padding: 9px 12px;
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
    .file-input {
      background: #f9fafb;
    }
    .upload-status {
      font-size: 12px;
      color: #2563eb;
      margin-top: 6px;
    }
    .image-preview {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 10px;
    }
    .image-preview img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #2563eb;
    }
    .preview-ok {
      font-size: 12px;
      color: #059669;
      font-weight: 600;
    }
    .section-divider {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 20px 0 16px 0;
    }
    .section-heading {
      font-size: 15px;
      font-weight: 700;
      color: #374151;
      margin: 0 0 14px 0;
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
export class RegisterComponent {
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    profilePictureUrl: '',
    cardNumber: '',
    cardHolder: '',
    expirationDate: '',
    cvv: ''
  };

  uploadingImage = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    this.uploadingImage = true;
    this.errorMessage = '';

    // Step 1: Request presigned URL from backend
    this.authService.getPresignedUrl(file.name).subscribe({
      next: (res) => {
        // Step 2: Upload directly to MinIO
        this.authService.uploadImageToMinio(res.uploadUrl, file).subscribe({
          next: () => {
            this.formData.profilePictureUrl = res.fileUrl;
            this.uploadingImage = false;
          },
          error: (uploadErr) => {
            console.error('MinIO upload error', uploadErr);
            this.errorMessage = 'Neuspešan upload slike na storage.';
            this.uploadingImage = false;
          }
        });
      },
      error: (presignedErr) => {
        console.error('Presigned URL error', presignedErr);
        this.errorMessage = 'Neuspešno dobavljanje linka za upload slike.';
        this.uploadingImage = false;
      }
    });
  }

  onRegister(): void {
    this.errorMessage = '';
    this.loading = true;

    this.authService.register(this.formData).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message || 'Registracija uspešna! Aktivacioni link je poslat na vaš email.';
      },
      error: (err) => {
        this.loading = false;
        if (err.error && typeof err.error === 'object') {
          const firstKey = Object.keys(err.error)[0];
          this.errorMessage = err.error[firstKey] || 'Greška pri registraciji.';
        } else {
          this.errorMessage = 'Greška pri registraciji.';
        }
      }
    });
  }
}
