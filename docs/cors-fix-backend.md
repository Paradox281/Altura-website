# 🔧 Perbaikan CORS untuk Download APK

## 🚨 Masalah yang Ditemukan

**Error CORS:** `Access to fetch at 'https://altura.up.railway.app/api/apk/download' from origin 'https://altura-website-production.up.railway.app' has been blocked by CORS policy`

## 🎯 Penyebab

Backend server `altura.up.railway.app` tidak mengizinkan request dari domain `altura-website-production.up.railway.app`

## 🛠️ Solusi di Backend (Recommended)

### 1. **Tambahkan CORS Headers di Backend**

```javascript
// Di backend server (Node.js/Express)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://altura-website-production.up.railway.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
```

### 2. **Atau Gunakan CORS Middleware**

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://altura-website-production.up.railway.app',
    'http://localhost:3000' // untuk development
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 🎯 Solusi di Frontend (Temporary)

### 1. **Proxy API (Sudah Dibuat)**
- Endpoint: `/api/proxy/apk-download`
- Bypass CORS dengan proxy lokal

### 2. **Direct Download Button**
- Buka download di tab baru
- Bypass CORS restrictions

### 3. **No-CORS Mode**
```javascript
fetch(url, { mode: 'no-cors' })
```

## 📋 Langkah Implementasi

### **Backend (Recommended)**
1. Update CORS policy di server APK
2. Izinkan domain website production
3. Test download langsung

### **Frontend (Temporary)**
1. Gunakan proxy API yang sudah dibuat
2. Fallback ke direct download button
3. Monitor error dan success rate

## 🔍 Testing

### **Test CORS Fix**
```bash
# Test dengan curl
curl -H "Origin: https://altura-website-production.up.railway.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://altura.up.railway.app/api/apk/download
```

### **Expected Response Headers**
```
Access-Control-Allow-Origin: https://altura-website-production.up.railway.app
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## 📝 Catatan Penting

- **CORS adalah security feature** browser, bukan bug
- **Solusi backend lebih aman** dan recommended
- **Proxy API adalah temporary solution**
- **Direct download button** untuk user experience yang lebih baik

## 🚀 Next Steps

1. **Contact backend team** untuk fix CORS
2. **Test proxy API** yang sudah dibuat
3. **Monitor download success rate**
4. **Remove proxy** setelah CORS fixed
