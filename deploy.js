// هذا الملف سيتم تشغيله أثناء عملية النشر في Vercel
const fs = require('fs');
const path = require('path');

// قراءة ملف env.js
const envFilePath = path.join(__dirname, 'env.js');
let envFileContent = fs.readFileSync(envFilePath, 'utf8');

// قائمة المتغيرات التي سيتم استبدالها
const variables = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
  'FIREBASE_MEASUREMENT_ID'
];

// استبدال كل متغير بقيمته من متغيرات البيئة
variables.forEach(variable => {
  const value = process.env[variable] || '';
  const placeholder = `%%${variable}%%`;
  envFileContent = envFileContent.replace(placeholder, value);
});

// كتابة الملف المعدل
fs.writeFileSync(envFilePath, envFileContent, 'utf8');

console.log('تم استبدال متغيرات البيئة بنجاح!'); 