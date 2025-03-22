// تكوين Firebase
const firebaseConfig = {
  apiKey: window.ENV && window.ENV.FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: window.ENV && window.ENV.FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: window.ENV && window.ENV.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: window.ENV && window.ENV.FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: window.ENV && window.ENV.FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: window.ENV && window.ENV.FIREBASE_APP_ID || "YOUR_APP_ID",
  measurementId: window.ENV && window.ENV.FIREBASE_MEASUREMENT_ID || "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
try {
  // التحقق مما إذا كان Firebase قد تم تهيئته مسبقاً
  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
} catch (error) {
  console.error("خطأ في تهيئة Firebase:", error);
}

// المتغيرات المهمة
const auth = firebase.auth();
const db = firebase.firestore();

// تصدير الكائنات للاستخدام في الملفات الأخرى
export { auth, db }; 