# Proje Kuralları

## GitHub İşlemleri
- **Hiçbir zaman sormadan GitHub'a push etme.** Kullanıcı açıkça istemeden commit/push yapma.
- Değişiklikleri commit etmeden önce kullanıcıya sor.

## Database Dosyaları
- **BU PROJE İÇİN GEÇERLİ DEĞİL**: Kullanıcı GitHub'ı yedek olarak kullanıyor, kodlar public olunca silinecek.
- Normalde: `db/pb_data/` klasöründeki database dosyalarını **asla commit etme**.
- Normalde: Bu dosyalar .gitignore'da olmalı.

## API Routes Yapısı
- Admin panel API'leri: `server/api/admin/` altında
- Auth API'leri: `server/api/auth/` altında
- Filemanager API'leri: `server/api/filemanager/` altında

## Import Path'leri
- Dosya taşıma/ yeniden adlandirme işlemlerinde import path'lerini güncelle.
- Path'lerin doğru olduğunu kontrol et (özellikle `../../validations` vs `../../../validations` gibi relative path'ler).

## Kod Stili
- Mevcut kod stilini takip et.
- Ekstra yorum ekleme (kullanıcı istemeden).
- Var olan dosyaları düzenlerken mevcut yapıyı koru.

## Test ve Build
- Önemli değişikliklerden sonra `npm run build` ile projenin çalıştığını doğrula.

## Türkçe Karakter Kullanımı
- Button ismi, Sayfa Başlığı, Menü Başlığı, Form Başlığı, Form Elemanları, Tablo Başlıkları, gibi kod harici yazılan yerlerde Türkçe karakter kullan. Örnek: Markayi Duzenle -> Markayı Düzenle.

## PocketBase Forntend Kullanımı
- PocketBase kesinlikle Forntend üzerinden çağrılmayacak. Frontend -> Backend -> PocketBase üzerinden çağrılacak.

## Iconlar&Simgeler
- Aksi belirtilmedikçe ihtiyaç duyulan icon lar app/assets/icon dizini altında svg formatındakiler ise app/assets/svg altında yaratılsın. Buradan çağrılsın.
- Yeni bir icon veya simge yaratmadan önce app/assets/svg klasörü altına bakılsın. Varsa buradaki kullanılsın.