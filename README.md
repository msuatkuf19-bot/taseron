# TAŞERONCUM.COM

İnşaat sektörü için tasarlanmış iki taraflı online pazaryeri platformu. Firmalar iş ilanı açabilir, taşeronlar teklif verebilir.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC)

## 🚀 Özellikler

### Genel
- ✅ Responsive tasarım (mobil uyumlu)
- ✅ Modern UI/UX (shadcn/ui bileşenleri)
- ✅ Türkçe arayüz
- ✅ **Admin onay sistemi**

### Firma Özellikleri
- ✅ Kayıt ve giriş sistemi
- ✅ Onaylanmış ilanları görüntüleme
- ✅ Teklifleri görüntüleme ve yönetme
- ✅ Teklif kabul/red işlemleri
- ✅ Taşeronlara puan ve yorum verme
- ✅ Profil yönetimi

### Taşeron Özellikleri
- ✅ Kayıt ve giriş sistemi
- ✅ **İlan oluşturma ve yönetme**
- ✅ **İlanları onaya gönderme**
- ✅ **Taslak ilanlar**
- ✅ **Reddedilen ilanları düzenleme**
- ✅ Onaylanmış ilanları listeleme ve filtreleme
- ✅ Teklif verme (fiyat, süre, mesaj)
- ✅ Verilen teklifleri takip etme
- ✅ Profil ve portfolio yönetimi

### Admin Özellikleri
- ✅ Dashboard istatistikleri
- ✅ Kullanıcı yönetimi (aktif/pasif)
- ✅ **İlan onay kuyruğu**
- ✅ **İlan onaylama/reddetme (sebep zorunlu)**
- ✅ İlan yönetimi (durum değiştirme, silme)
- ✅ Yorum yönetimi (silme)

## 📋 Gereksinimler

- Node.js 18+
- PostgreSQL veritabanı
- npm veya yarn

## 🛠️ Kurulum

### 1. Projeyi klonlayın

```bash
git clone https://github.com/your-username/taseroncum.git
cd taseroncum
```

### 2. Bağımlılıkları yükleyin

```bash
npm install
```

### 3. Ortam değişkenlerini ayarlayın

`.env` dosyası oluşturun:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Veritabanını oluşturun

```bash
# Prisma migration çalıştır
npx prisma migrate dev --name init

# Veritabanını seed et (demo veriler)
npx prisma db seed
```

### 5. Uygulamayı başlatın

```bash
# Development modu
npm run dev

# Production build
npm run build
npm start
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 🔐 Demo Hesapları

Seed data çalıştırıldıktan sonra aşağıdaki demo hesapları kullanabilirsiniz:

| Rol | E-posta | Şifre |
|-----|---------|-------|
| Admin | admin@taseroncum.com | 123456 |
| Firma | firma1@taseroncum.com | 123456 |
| Firma | firma2@taseroncum.com | 123456 |
| Taşeron | taseron1@taseroncum.com | 123456 |
| Taşeron | taseron2@taseroncum.com | 123456 |
| Taşeron | taseron3@taseroncum.com | 123456 |
| Taşeron | taseron4@taseroncum.com | 123456 |
| Taşeron | taseron5@taseroncum.com | 123456 |

## 📁 Proje Yapısı

```
taseroncum/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin panel sayfaları
│   ├── dashboard/
│   │   ├── firma/          # Firma dashboard
│   │   └── taseron/        # Taşeron dashboard
│   ├── firma/[id]/         # Firma profil sayfası
│   ├── taseron/[id]/       # Taşeron profil sayfası
│   ├── ilan/[id]/          # İlan detay sayfası
│   ├── ilanlar/            # İlan listeleme sayfası
│   ├── login/              # Giriş sayfası
│   ├── register/           # Kayıt sayfası
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Ana sayfa
├── actions/                 # Server Actions
│   ├── admin.ts
│   ├── auth.ts
│   ├── bids.ts
│   ├── jobs.ts
│   ├── profile.ts
│   └── reviews.ts
├── components/
│   ├── admin/              # Admin bileşenleri
│   ├── dashboard/          # Dashboard bileşenleri
│   ├── jobs/               # İlan bileşenleri
│   ├── layout/             # Layout bileşenleri
│   └── ui/                 # UI bileşenleri (shadcn/ui)
├── lib/
│   ├── auth.ts             # NextAuth konfigürasyonu
│   ├── prisma.ts           # Prisma client
│   ├── utils.ts            # Yardımcı fonksiyonlar
│   └── validators.ts       # Zod şemaları
├── prisma/
│   ├── schema.prisma       # Veritabanı şeması
│   └── seed.ts             # Seed verileri
├── middleware.ts           # NextAuth middleware
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## 🗃️ Veritabanı Şeması

### Modeller

- **User**: Kullanıcı hesapları (Admin, Firma, Taşeron)
- **CompanyProfile**: Firma profil bilgileri
- **ContractorProfile**: Taşeron profil bilgileri
- **JobPost**: İş ilanları
- **Bid**: Teklifler
- **Review**: Değerlendirmeler

### Enumlar

- **Role**: ADMIN, FIRMA, TASERON
- **JobStatus**: OPEN, CLOSED
- **BidStatus**: PENDING, ACCEPTED, REJECTED
- **Category**: KABA_INSAAT, INCE_INSAAT, ELEKTRIK, TESISAT, BOYA_BADANA, DEKORASYON, IZOLASYON, CELIK_YAPI, PEYZAJ, RESTORASYON

## 🎨 Renk Paleti

| Renk | Hex | Kullanım |
|------|-----|----------|
| Primary | #F37021 | Ana turuncu renk |
| Primary Dark | #D85F17 | Hover durumu |
| Dark | #2E2E2E | Metin rengi |
| Muted | #6B7280 | İkincil metin |
| Background | #F5F5F5 | Arka plan |

## 🔧 Komutlar

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Production sunucusu
npm start

# Linting
npm run lint

# Prisma Studio (veritabanı GUI)
npx prisma studio

# Migration oluşturma
npx prisma migrate dev --name migration_name

# Seed çalıştırma
npx prisma db seed
```

## 📝 Ortam Değişkenleri

| Değişken | Açıklama | Örnek |
|----------|----------|-------|
| DATABASE_URL | PostgreSQL bağlantı URL'i | postgresql://user:pass@localhost:5432/taseroncum |
| NEXTAUTH_SECRET | NextAuth gizli anahtarı | random-32-char-string |
| NEXTAUTH_URL | Uygulama URL'i | http://localhost:3000 |

## 🆕 Admin Onay Sistemi

Taşeronlar artık ilan oluşturabilir ve admin onayına gönderebilir:

1. **Taşeron İlanı Oluşturur:** DRAFT olarak kaydedilir
2. **Onaya Gönderir:** PENDING_APPROVAL durumuna geçer
3. **Admin İnceler:** Onay kuyruğundan detayları görür
4. **Karar Verir:**
   - **ONAYLA:** İlan yayına girer (APPROVED)
   - **REDDET:** Sebep yazılır, taşeron düzenleyip tekrar gönderebilir

Detaylı bilgi için: [APPROVAL_SYSTEM_DOCS.md](APPROVAL_SYSTEM_DOCS.md)

## 📄 Lisans

MIT License

## 👨‍💻 Geliştirici

Bu proje AI yardımı ile oluşturulmuştur.

---

**TAŞERONCUM.COM** - İnşaat Sektörünün Online Pazaryeri 🏗️
