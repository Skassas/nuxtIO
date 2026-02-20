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
- **Build alma: Kullanıcı istemeden build alma. Kullanıcıya kontrol edilmesini söyle ve onay beklenene kadar bekle.**

## Türkçe Karakter Kullanımı
- Button ismi, Sayfa Başlığı, Menü Başlığı, Form Başlığı, Form Elemanları, Tablo Başlıkları, gibi kod harici yazılan yerlerde Türkçe karakter kullan. Örnek: Markayi Duzenle -> Markayı Düzenle.

## PocketBase Forntend Kullanımı
- PocketBase kesinlikle Forntend üzerinden çağrılmayacak. Frontend -> Backend -> PocketBase üzerinden çağrılacak.

## Iconlar&Simgeler
- Aksi belirtilmedikçe ihtiyaç duyulan icon lar app/assets/icon dizini altında svg formatındakiler ise app/assets/svg altında yaratılsın. Buradan çağrılsın.
- Yeni bir icon veya simge yaratmadan önce app/assets/svg klasörü altına bakılsın. Varsa buradaki kullanılsın.

## Form Input Kuralları

### String Tipindeki Inputlar (useTurkishInput)
String tipindeki tüm form inputlarında `useTurkishInput` composable'ı kullanılır.

**Özellikler:**
- Sadece a-z, Türkçe karakterler (ğüşöçİĞÜŞÖÇ), 0-9, boşluk, tire (-) ve alt çizgi (_) kullanılır
- Boşluk ile başlanamaz
- İlk harf büyük (Türkçe karakterler dahil)

**Kullanım:**
```vue
<script setup>
import { useTurkishInput } from '~/composables/useTurkishInput'

const myField = useTurkishInput(props.modelValue.myField || '')

watch(() => form.value.myField, (val) => {
  myField.inputValue.value = val
})
watch(myField.inputValue, (val) => {
  form.value.myField = val
})
</script>

<template>
  <input 
    :value="myField.inputValue.value" 
    @input="(e) => { myField.handleInput(e); form.myField = myField.inputValue.value }" 
    @keydown="myField.handleKeyDown" 
  />
</template>
```

### Telefon Input (usePhoneInput)
Telefon inputları için telefon formatı uygulanır: `(5##) ### ## ##`

**Özellikler:**
- Giriş: `(5##) ### ## ##` formatında maskeleme
- Gösterim: `(xxx) xxx xx xx` formatında gösterilir

**Kullanım:**
```vue
<script setup>
const phoneDisplay = ref(props.modelValue.phone || '')

watch(() => props.modelValue.phone, (val) => {
  if (!val) phoneDisplay.value = ''
})

function handlePhoneInput(e: Event) {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '').slice(0, 10)
  
  let formatted = ''
  for (let i = 0; i < value.length; i++) {
    if (i === 0) formatted += '('
    if (i === 3) formatted += ') '
    if (i === 6) formatted += ' '
    if (i === 8) formatted += ' '
    formatted += value[i]
  }
  
  phoneDisplay.value = formatted
  form.value.phone = value
}

// Tablo/View'da gösterim için
function formatPhone(phone?: string) {
  if (!phone) return '-'
  const cleaned = phone.replace(/\D/g, '').slice(0, 10)
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`
  }
  return phone
}
</script>

<template>
  <input v-model="phoneDisplay" @input="handlePhoneInput" placeholder="(5__) ___ __ __" />
  <!-- Tablo/View'da: {{ formatPhone(phone) }} -->
</template>
```

### Numeric Input (useNumericInput)
Sadece rakam girişi için kullanılır (quantity, number, price, TCKN, vergi numarası gibi alanlarda).

**Özellikler:**
- Sadece 0-9 rakamları kullanılır

**Kullanım:**
```vue
<script setup>
import { useNumericInput } from '~/composables/useNumericInput'

const myField = useNumericInput(props.modelValue.myField?.toString() || '')

watch(() => form.value.myField, (val) => {
  myField.inputValue.value = val?.toString() || ''
})
watch(myField.inputValue, (val) => {
  form.value.myField = val ? Number(val) : null
})
</script>

<template>
  <input 
    :value="myField.inputValue.value" 
    @input="(e) => { myField.handleInput(e); form.myField = myField.inputValue.value }" 
    @keydown="myField.handleKeyDown" 
  />
</template>
```

## Yapılan Güncellemeler

### Müşteriler (Customers) CRUD
- `server/api/admin/customers/` dizini altında API endpoint'leri oluşturuldu
- `app/pages/admin/customers/` dizini altında sayfalar oluşturuldu
- `app/validations/customers.ts` validasyon dosyası eklendi
- Bireysel ve Kurumsal müşteri tipleri destekleniyor
- TCKN, vergi dairesi, vergi numarası gibi alanlar içerir

### Türkçe Arama Sistemi (search_index)
- PocketBase'de tüm collection'lara `search_index` alanı eklendi
- `normalizeForSearch` fonksiyonu ile Türkçe karakterler normalize ediliyor (ç->c, ğ->g, ı->i, ö->o, ş->s, ü->u)
- API'lerde arama yapılırken hem orijinal arama terimi hem de normalize edilmiş terim kullanılıyor
- Güncellenen collection'lar: brands, categories, manufacturers, units

### useTurkishLettersOnly
- Sadece harf içeren alanlar için yeni composable oluşturuldu
- Kullanım alanları: Vergi Dairesi, Şehir, Vergi Dairesi Başlığı
- Mevcut kullanım:
  - customers: `company_tax_city`
  - manufacturers: `tax_office`

### useTurkishInput Güncellemeleri
- Boşluktan sonra gelen kelimenin ilk harfi artık büyük yapılıyor
- Türkçe İ harfi sorunu düzeltildi (ı -> I yerine İ kullanımı)
- Türkçe küçük harf dönüşümü eklendi (İ -> i, I -> ı)

### Sort Sistemi İyileştirmeleri
- `useCrud.ts` içinde `sortBy` tipi `'name' | 'created'` yerine `string` olarak değiştirildi
- Dinamik sıralama desteği eklendi
- Categories'de sıralama kaldırıldı (hiyerarşik yapı)
- Manufacturers'da "Yetkili Kişi" sıralaması eklendi

### UI İyileştirmeleri

#### Toast Iconları
- HTML entity yerine SVG icon kullanımına geçildi
- Eklenen iconlar:
  - `ToastSuccessIcon.vue`
  - `ToastErrorIcon.vue`
  - `ToastWarningIcon.vue`
  - `ToastInfoIcon.vue`
  - `ToastCloseIcon.vue`

#### View Sayfaları
- Alanlar arasına border (alt çizgi) eklendi
- Son alanın altındaki border kaldırıldı
- Başlıklar mavi renk yapıldı (`text-blue-600 dark:text-blue-400`)
- Güncellenen sayfalar: brands, categories, manufacturers, units

#### Müşteri Tablosu
- TİP alanı telefon sonrasına taşındı
- Başlık "MÜŞTERİ TİPİ" yapıldı
- Bireysel için mavi, Kurumsal için mor renkler eklendi

### Helper Fonksiyonlar
- `server/utils/search.ts` - Türkçe arama normalizasyonu için yardımcı fonksiyonlar

### Textarea Input (useTextareaInput)
Textarea alanları için kullanılır. Tüm karakterlere izin verir.

**Özellikler:**
- Tüm karakterlere izin verir
- Boşluk ile başlanamaz
- İlk harf büyük (Türkçe karakterler dahil)

**Kullanım:**
```vue
<script setup>
import { useTextareaInput } from '~/composables/useTextareaInput'

const myField = useTextareaInput(props.modelValue.myField || '')

watch(() => form.value.myField, (val) => {
  myField.inputValue.value = val
})
watch(myField.inputValue, (val) => {
  form.value.myField = val
})
</script>

<template>
  <textarea 
    :value="myField.inputValue.value" 
    @input="(e) => { myField.handleInput(e); form.myField = myField.inputValue.value }" 
    @keydown="myField.handleKeyDown" 
  ></textarea>
</template>
```

### Sadece Harf İçeren Input (useTurkishLettersOnly)
Sadece harf içeren alanlar için kullanılır (vergi dairesi, vergi numarası başlığı, şehir gibi).

**Özellikler:**
- Sadece a-z ve Türkçe karakterler (ğüşöçİĞÜŞÖÇ) kullanılır
- Boşluk ile başlanamaz
- İlk harf büyük (Türkçe karakterler dahil)

**Kullanım:**
```vue
<script setup>
import { useTurkishLettersOnly } from '~/composables/useTurkishLettersOnly'

const myField = useTurkishLettersOnly(props.modelValue.myField || '')

watch(() => form.value.myField, (val) => {
  myField.inputValue.value = val
})
watch(myField.inputValue, (val) => {
  form.value.myField = val
})
</script>

<template>
  <input 
    :value="myField.inputValue.value" 
    @input="(e) => { myField.handleInput(e); form.myField = myField.inputValue.value }" 
    @keydown="myField.handleKeyDown" 
  />
</template>
```

