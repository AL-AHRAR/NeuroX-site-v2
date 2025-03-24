// إخفاء المعلومات الحساسة من خلال تشفير بسيط
(function() {
  // دالة بسيطة لفك تشفير النص المشفر
  function decode(encoded) {
    return atob(encoded.split('').reverse().join(''));
  }
  
  // المعلومات مشفرة بشكل بسيط (تم عكس الحروف ثم التشفير بـ base64)
  const encodedKeys = {
    API_KEY: "Y3JZbUc3MzIwMTQ2N3RoZDE6c2V3MTpEOFlEYXN6QUlB",
    AUTH_DOMAIN: "bW9jLnBwYWVzYWJlcmlmLmV0aXNiZXctaWEteGlocG9ydWVu",
    PROJECT_ID: "ZXRpc2Jldy1pYS14aWhwb3J1ZW4=",
    STORAGE_BUCKET: "cHBhLmVnYXJvdHNlc2FiZXJpZi5ldGlzYmV3LWlhLXhpaHBvcnVlbg==",
    MESSAGING_SENDER_ID: "NjUwMDM3ODM3Mzc1",
    APP_ID: "ZDYyZDIzMDE6NjQzODY2Yzg6YmV3OjY1MDQzNzgzNzM3NToxOmE6MmI4OGI=",
    MEASUREMENT_ID: "NVJKSkxDVkRXUC1H"
  };
  
  // إنشاء كائن ENV مع فك تشفير المفاتيح
  window.ENV = {
    FIREBASE_API_KEY: decode(encodedKeys.API_KEY),
    FIREBASE_AUTH_DOMAIN: decode(encodedKeys.AUTH_DOMAIN),
    FIREBASE_PROJECT_ID: decode(encodedKeys.PROJECT_ID),
    FIREBASE_STORAGE_BUCKET: decode(encodedKeys.STORAGE_BUCKET),
    FIREBASE_MESSAGING_SENDER_ID: decode(encodedKeys.MESSAGING_SENDER_ID),
    FIREBASE_APP_ID: decode(encodedKeys.APP_ID),
    FIREBASE_MEASUREMENT_ID: decode(encodedKeys.MEASUREMENT_ID)
  };
  
  // حذف الكائن المشفر من الذاكرة
  encodedKeys = null;
})(); 