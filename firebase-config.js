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
  console.log("تم تهيئة Firebase بنجاح!");
} catch (error) {
  console.error("خطأ في تهيئة Firebase:", error);
}

// المتغيرات المهمة - جعلها متاحة عالمياً
const auth = firebase.auth();
const db = firebase.firestore();

// دالة للتحقق من جاهزية الاتصال بـ Firebase
function isFirebaseReady() {
  return typeof firebase !== 'undefined' && 
         typeof auth !== 'undefined' && 
         typeof db !== 'undefined';
}

// إضافة مستمع حدث للتأكد من أن كل شيء جاهز
window.addEventListener('DOMContentLoaded', function() {
  if (isFirebaseReady()) {
    console.log("Firebase جاهز للاستخدام!");
  } else {
    console.error("Firebase غير جاهز! يرجى التحقق من التكوين.");
  }
}); 