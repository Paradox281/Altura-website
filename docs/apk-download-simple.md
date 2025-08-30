# 📱 Download APK - File Lokal

## ✅ Solusi Sederhana

Download APK langsung dari file lokal di folder `public/` tanpa menggunakan API eksternal.

## 🗂️ Struktur File

```
public/
  └── altura-android.apk  (81.4 MB)
```

## 🛠️ Cara Kerja

1. **User klik tombol "Download APK"**
2. **Progress bar berjalan** (simulasi)
3. **File langsung diunduh** dari `/altura-android.apk`
4. **Download selesai** dengan nama `Altura.apk`

## 🔧 Konfigurasi

### **next.config.js**
```javascript
async headers() {
  return [
    {
      source: '/altura-android.apk',
      headers: [
        {
          key: 'Content-Type',
          value: 'application/vnd.android.package-archive',
        },
        {
          key: 'Content-Disposition',
          value: 'attachment; filename="Altura.apk"',
        },
        {
          key: 'Cache-Control',
          value: 'no-cache, no-store, must-revalidate',
        },
      ],
    },
  ]
}
```

## 📋 Keuntungan

- ✅ **Tidak ada CORS issues**
- ✅ **Download lebih cepat**
- ✅ **Lebih reliable**
- ✅ **Lebih sederhana**

## 🚀 Cara Update APK

1. **Ganti file** `public/altura-android.apk` dengan versi baru
2. **Restart server** untuk apply konfigurasi
3. **Test download** untuk memastikan berfungsi

## 🔍 Testing

1. Buka website
2. Klik "Pesan Sekarang"
3. Klik "Download APK"
4. File APK seharusnya mulai download

## 📝 Catatan

- File APK harus selalu up-to-date di folder public
- Ukuran file 81.4 MB
- Browser akan mengenali sebagai file APK
- Tidak ada dependency pada server eksternal
