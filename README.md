# OnlyKicks - Scalable Platform for Sneaker Sales (NVT / ISA 2026/27)

OnlyKicks je skalabilno softversko rešenje za prodaju patika razvijeno u sklopu predmeta Napredne veb tehnologije / Internet softverske arhitekture.

---

<<<<<<< HEAD
## 👤 Informacije o studentu
- **Ime i prezime:** Teodora Nikolić
- **Broj indeksa:** SV66/2022
- **Status:** Stari student

---

=======
>>>>>>> f5791767b14a9884ea137ab856bdf96b07af714a
## 🛠️ Korišćene tehnologije
- **Backend:** Java 17+, Spring Boot 4 / 3, Spring Data JPA, Spring Security, JJWT
- **Frontend:** Angular 20 Standalone, TypeScript, CSS
- **Baza podataka:** PostgreSQL 17 / 16 (optimizovani indeksi i `pg_trgm`)
- **BLOB Storage:** MinIO (S3 kompatibilno skladište, presigned upload URLs)
- **Email (Dev alat):** Mailpit (port 8025)
- **Kontejnerizacija:** Docker, Docker Compose

---

## 🚀 Uputstvo za pokretanje sistema

### 1. Pokretanje infrastrukture (Docker Compose)
U korenu projekta pokrenuti kontejnere za MinIO i Mailpit:
```bash
docker compose up -d
```
- **Mailpit Web UI:** `http://localhost:8025`
- **MinIO Web Console:** `http://localhost:9006` (`minioadmin` / `minioadmin`)
- **PostgreSQL:** `localhost:5432` (baza: `onlykicks`, user: `postgres`, lozinka: `123456`)

### 2. Pokretanje Backend servera
```bash
cd project
./mvnw spring-boot:run
```
Backend se pokreće na portu `8080`.

### 3. Pokretanje Frontend aplikacije
```bash
cd frontend
npm install
npm start
```
Frontend aplikacija je dostupna na `http://localhost:4200`.

---

## 💾 Popunjavanje baze testnim podacima (Zahtev 3.5 za KT)

Baza se popunjava sa **preko 1.000.000 korisnika i 10.000 administratora** za manje od 45 sekundi korišćenjem native PostgreSQL generatora:

```bash
# Pokretanje seed skripte (iz korena projekta)
psql -U postgres -h localhost -p 5432 -d onlykicks -f seed_users.sql
```

Skripta:
1. Generiše 10.000 administratora sa povezanim platnim karticama.
2. Generiše 1.000.000 kupaca sa sinhronizovanim platnim karticama i realističnim podacima.
3. Kreira GIN i B-tree indekse (`pg_trgm`) za pretragu ispod 1 milisekunde.

---

## 🔑 Testni nalozi

- **Glavni Administrator:** `admin@onlykicks.com` / `admin123`
- **Pomoćni Administrator:** `admin2@onlykicks.com` / `admin123`
- **Sintetički korisnici:** `user_1@example.com` do `user_1000000@example.com` (lozinka: `password123`)
