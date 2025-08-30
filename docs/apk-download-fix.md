# 🔧 Perbaikan Download APK - File Lokal

## 🚨 Masalah Sebelumnya

**Error CORS:** `Access to fetch at 'https://altura.up.railway.app/api/apk/download' from origin 'https://altura-website-production.up.railway.app' has been blocked by CORS policy`

## ✅ Solusi yang Diterapkan

### **1. Pindah ke File Lokal**
- **Sebelum:** Download dari API server `https://altura.up.railway.app/api/apk/download`
- **Sesudah:** Download dari file lokal `/altura-android.apk`

### **2. Keuntungan Solusi Ini**
- ✅ **Tidak ada CORS issues** - file dari domain yang sama
- ✅ **Lebih cepat** - tidak perlu request ke server eksternal
- ✅ **Lebih reliable** - tidak bergantung pada server eksternal
- ✅ **Lebih aman** - file di-serve dari domain sendiri

## 🛠️ Implementasi

### **File yang Diubah:**

1. **`components/booking-form.tsx`**
   ```typescript
   // Sebelum
   const response = await fetch("https://altura.up.railway.app/api/apk/download", {...})
   
   // Sesudah  
   const response = await fetch("/altura-android.apk", {...})
   ```

2. **`next.config.js`**
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

### **Struktur File:**
```
public/
  └── altura-android.apk  (81MB)
```

## 🔍 Testing

### **Test Download APK:**
1. Buka website
2. Klik tombol "Pesan Sekarang"
3. Klik tombol "Download APK"
4. File APK seharusnya mulai download

### **Expected Behavior:**
- ✅ Progress bar berjalan normal
- ✅ File APK berhasil diunduh
- ✅ Tidak ada error CORS
- ✅ File size: 81.4 MiB

## 📋 Langkah Deployment

### **1. Pastikan File APK Ada**
```bash
# File harus ada di folder public
ls -la public/altura-android.apk
```

### **2. Restart Server**
```bash
# Restart Next.js server untuk apply config baru
npm run dev
# atau
npm run build && npm start
```

### **3. Test Download**
- Buka website
- Test download APK
- Verifikasi file berhasil diunduh

## 🚀 Next Steps

### **Jangka Pendek:**
1. ✅ Test download APK dari file lokal
2. ✅ Monitor success rate
3. ✅ Verifikasi file integrity

### **Jangka Panjang:**
1. **Update APK secara berkala** - ganti file di folder public
2. **Implementasi versioning** - tambah timestamp atau version number
3. **Auto-update mechanism** - pull APK terbaru dari server

## 📝 Catatan Penting

- **File APK harus selalu up-to-date** di folder public
- **Ukuran file 81MB** - pastikan hosting mendukung file besar
- **Cache control** - file tidak akan di-cache browser
- **Content-Type** - browser akan mengenali sebagai file APK

## 🔧 Troubleshooting

### **Jika Download Masih Gagal:**
1. **Periksa file exists:**
   ```bash
   ls -la public/altura-android.apk
   ```

2. **Periksa permissions:**
   ```bash
   chmod 644 public/altura-android.apk
   ```

3. **Periksa next.config.js:**
   - Pastikan headers sudah benar
   - Restart server setelah perubahan

4. **Periksa browser console:**
   - Lihat network requests
   - Lihat error messages

### **Jika File Terlalu Besar:**
1. **Compress APK** - gunakan tools seperti APKTool
2. **Split download** - implementasi chunked download
3. **CDN** - gunakan CDN untuk file besar
