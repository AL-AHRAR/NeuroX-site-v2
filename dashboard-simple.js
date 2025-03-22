// استخدام كائنات Firebase من ملف التكوين
// نفترض أن كائنات auth و db معرفة مسبقاً في firebase-config.js

// متغيرات عامة
let currentUserFirebase = null;
let domElements = {};
let themeMode = localStorage.getItem('themeMode') || 'dark'; // استرجاع وضع الثيم المخزن

// تطبيق الثيم الأولي فورًا من localStorage عند تحميل الصفحة
(() => {
    console.log('تهيئة الثيم الأولي:', themeMode);
    
    // تطبيق الثيم بشكل مباشر
    if (themeMode === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // التحقق من أن الثيم تم تطبيقه بنجاح
    console.log('حالة الثيم بعد التهيئة الأولية:', 
               document.documentElement.classList.contains('dark') ? 'مظلم' : 'فاتح');
})();

// دالة تطبيق الثيم مباشرة - تأكيد 100% من التطبيق
function applyTheme(mode) {
    console.log('جاري تطبيق الثيم:', mode);
    
    if (mode === 'dark') {
        // تطبيق الثيم المظلم
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
        document.body.style.backgroundColor = '#111827';
        
        // تحديث زر التبديل إن وجد
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.classList.remove('light-mode');
        }
    } else {
        // تطبيق الثيم الفاتح
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
        document.body.style.backgroundColor = '#f9fafb';
        
        // تحديث زر التبديل إن وجد
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.classList.add('light-mode');
        }
    }
    
    // تأكيد التطبيق
    console.log('تم تطبيق الثيم:', mode);
    console.log('حالة الثيم بعد التطبيق:',
               document.documentElement.classList.contains('dark') ? 'مظلم' : 'فاتح');
}

// دالة لتحديث الثيم
const updateThemeMode = (mode) => {
    console.log('تحديث وضع الثيم إلى:', mode);
    
    // تطبيق الثيم على عناصر الصفحة
    applyTheme(mode);
    
    // تخزين وتحديث متغير الثيم
    localStorage.setItem('themeMode', mode);
    themeMode = mode;
};

// دالة تنسيق الوقت بصيغة نسبية
const formatRelativeTime = (lastSignInTime) => {
    const now = new Date();
    const lastSignIn = new Date(lastSignInTime);
    const diffInMillis = now - lastSignIn;
    
    // تحويل الوقت إلى ثواني
    const diffInSeconds = Math.floor(diffInMillis / 1000);
    
    // تحويل إلى دقائق، ساعات، أيام، أسابيع
    if (diffInSeconds < 60) {
        return 'قبل لحظات';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : (minutes >= 3 && minutes <= 10) ? 'دقائق' : 'دقيقة'}`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `منذ ${hours} ${hours === 1 ? 'ساعة' : (hours >= 3 && hours <= 10) ? 'ساعات' : 'ساعة'}`;
    } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
    } else if (diffInSeconds < 2628000) {
        const weeks = Math.floor(diffInSeconds / 604800);
        return `منذ ${weeks} ${weeks === 1 ? 'أسبوع' : 'أسابيع'}`;
    } else if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2628000);
        return `منذ ${months} ${months === 1 ? 'شهر' : 'أشهر'}`;
    } else {
        const years = Math.floor(diffInSeconds / 31536000);
        return `منذ ${years} ${years === 1 ? 'سنة' : 'سنوات'}`;
    }
};

// دالة تهيئة عناصر DOM
const initializeDOMElements = () => {
    console.log('جاري تهيئة عناصر DOM...');
    domElements = {
        logoutBtn: document.getElementById('logoutBtn'),
        requestAccessBtn: document.getElementById('requestAccessBtn'),
        resendVerificationEmail: document.getElementById('resendVerificationEmail'),
        loadingScreen: document.getElementById('loadingScreen'),
        requestStatusContainer: document.getElementById('requestStatusContainer'),
        requestStatus: document.getElementById('requestStatus'),
        userEmail: document.getElementById('userEmail'),
        emailVerificationStatus: document.getElementById('emailVerificationStatus'),
        userCreatedAt: document.getElementById('userCreatedAt'),
        userInitials: document.getElementById('userInitials'),
        lastLoginTime: document.getElementById('lastLoginTime'),
        accessStatusDisplay: document.getElementById('accessStatusDisplay'),
        themeToggle: document.getElementById('themeToggle'),
        infoIcon: document.getElementById('infoIcon'),
        infoModalOverlay: document.getElementById('infoModalOverlay'),
        infoModalClose: document.getElementById('infoModalClose')
    };

    // التحقق من وجود العناصر وإضافة مستمعي الأحداث
    if (domElements.logoutBtn) {
        domElements.logoutBtn.addEventListener('click', handleLogout);
    }

    if (domElements.requestAccessBtn) {
        domElements.requestAccessBtn.addEventListener('click', handleRequestAccess);
    }

    if (domElements.resendVerificationEmail) {
        domElements.resendVerificationEmail.addEventListener('click', handleResendVerification);
    }
    
    // إضافة مستمع حدث لزر تبديل الثيم
    if (domElements.themeToggle) {
        domElements.themeToggle.addEventListener('click', toggleTheme);
        // تحديث حالة الزر استنادًا إلى الثيم الحالي
        updateThemeMode(themeMode);
    }
    
    // إضافة مستمعي الأحداث لأيقونة المعلومات والنافذة المنبثقة
    if (domElements.infoIcon) {
        domElements.infoIcon.addEventListener('click', showInfoModal);
    }
    
    if (domElements.infoModalClose) {
        domElements.infoModalClose.addEventListener('click', hideInfoModal);
    }
    
    if (domElements.infoModalOverlay) {
        // إغلاق النافذة عند النقر خارجها
        domElements.infoModalOverlay.addEventListener('click', (e) => {
            if (e.target === domElements.infoModalOverlay) {
                hideInfoModal();
            }
        });
    }
};

// دالة إظهار النافذة المنبثقة للمعلومات
const showInfoModal = (e) => {
    e.stopPropagation(); // منع انتشار الحدث للأزرار الأخرى
    
    if (!domElements.infoModalOverlay) return;
    
    // إضافة تأثير حركي عند الظهور
    domElements.infoModalOverlay.classList.add('show');
    
    // إضافة تأثير الضبابية للخلفية
    document.body.style.overflow = 'hidden';
    
    // تشغيل صوت المعلومات (اختياري)
    try {
        const infoSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBzb3VuZCBlZmZlY3QgY2xpY2sAVElUMgAAABgAAANMaWNlbnNlZCB1bmRlciBDQyBCWQBUQUxCAAAAGAAAA1BvcCBTb3VuZCBQbG9wAFBFMQAAAAwAAANVbmtub3duAFRDT04AAAAcAAAAU0ZYMSBTY2kgRmkgQmVlcCBQb3AAVFlFUgAAAAAAAABDT01NAAAALwBFbmdpbmVlcmVkIHdpdGggTG92ZSBieSBDaGFybGllIFdhdHNvbiwgTExDAERJU0MAAAAA');
        infoSound.volume = 0.2;
        infoSound.play();
    } catch (error) {
        // التعامل بصمت مع أي خطأ في تشغيل الصوت
    }
    
    // إضافة استجابة للمفاتيح لإغلاق النافذة بمفتاح Escape
    document.addEventListener('keydown', handleEscapeKey);
};

// دالة إخفاء النافذة المنبثقة للمعلومات
const hideInfoModal = () => {
    if (!domElements.infoModalOverlay) return;
    
    // إزالة تأثير الظهور
    domElements.infoModalOverlay.classList.remove('show');
    
    // إعادة التمرير للصفحة
    document.body.style.overflow = '';
    
    // إزالة استجابة مفتاح Escape
    document.removeEventListener('keydown', handleEscapeKey);
};

// دالة معالجة مفتاح Escape لإغلاق النافذة
const handleEscapeKey = (e) => {
    if (e.key === 'Escape') {
        hideInfoModal();
    }
};

// دالة تبديل الثيم
const toggleTheme = () => {
    // تبديل الثيم
    const newMode = themeMode === 'dark' ? 'light' : 'dark';
    console.log('تغيير التيم من', themeMode, 'إلى', newMode);
    
    // إضافة تأثير البصري أثناء التبديل
    document.body.style.transition = 'background-color 0.5s ease';
    
    // إضافة تأثير النبض
    const themeToggleElement = document.getElementById('themeToggle');
    if (themeToggleElement) {
        themeToggleElement.classList.add('pulse');
        
        // إضافة صوت نقرة خفيفة (اختياري)
        try {
            const clickSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBzb3VuZCBlZmZlY3QgY2xpY2sAVElUMgAAABgAAANMaWNlbnNlZCB1bmRlciBDQyBCWQBUQUxCAAAAGAAAA1RvZ2dsZSBzd2l0Y2ggc291bmQAVFBFMQAAAAwAAANVbmtub3duAFRDT04AAAAcAAAAU0ZYMSBTY2kgRmkgVHJhbnNpdGlvbgBUWUVSAAAAAAAAAENPTU0AAAAvAEVuZ2luZWVyZWQgd2l0aCBMb3ZlIGJ5IENoYXJsaWUgV2F0c29uLCBMTEMARElTQwAAAAA=');
            clickSound.volume = 0.2;
            clickSound.play();
        } catch (error) {
            // التعامل بصمت مع أي خطأ في تشغيل الصوت
        }
        
        setTimeout(() => {
            themeToggleElement.classList.remove('pulse');
        }, 500);
    }
    
    // استخدام تأثير انتقالي للعناصر
    const elements = document.querySelectorAll('h1, h2, h3, p, div, button, a, span');
    elements.forEach(element => {
        element.style.transition = 'background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease';
    });
    
    // تحديث وضع الثيم
    updateThemeMode(newMode);
    
    // تطبيق تأثير بصري على البطاقة الرئيسية
    const mainCard = document.querySelector('.card');
    if (mainCard) {
        if (newMode === 'dark') {
            mainCard.animate([
                { opacity: 0.8, transform: 'scale(0.98)' },
                { opacity: 1, transform: 'scale(1)' }
            ], {
                duration: 400,
                easing: 'ease-out'
            });
        } else {
            mainCard.animate([
                { opacity: 0.8, transform: 'scale(0.98)' },
                { opacity: 1, transform: 'scale(1)' }
            ], {
                duration: 400,
                easing: 'ease-out'
            });
        }
    }
};

// تحديث واجهة المستخدم
const updateUserInterface = (user) => {
    if (!user || !domElements) {
        console.warn('المستخدم أو عناصر DOM غير متاحة');
        return;
    }

    try {
        // تحديث البريد الإلكتروني والأحرف الأولى
        if (domElements.userEmail) {
            domElements.userEmail.textContent = user.email || '';
            const initials = user.email ? user.email.split('@')[0].substring(0, 2).toUpperCase() : '';
            
            // تحديث الأحرف الأولى
            if (domElements.userInitials) {
                domElements.userInitials.textContent = initials;
            }
        }

        // تحديث حالة التحقق من البريد
        const isVerified = user.emailVerified;
        
        if (domElements.emailVerificationStatus) {
            if (isVerified) {
                domElements.emailVerificationStatus.innerHTML = 
                    '<span class="badge badge-verified">تم التحقق</span>';
                
                // إخفاء زر إعادة إرسال التحقق
                if (domElements.resendVerificationEmail) {
                    domElements.resendVerificationEmail.classList.add('hidden');
                }
            } else {
                domElements.emailVerificationStatus.innerHTML = 
                    '<span class="badge badge-pending">في انتظار التحقق</span>';
                
                // إظهار زر إعادة إرسال التحقق
                if (domElements.resendVerificationEmail) {
                    domElements.resendVerificationEmail.classList.remove('hidden');
                }
            }
        }

        // تحديث تاريخ الإنشاء
        if (user.metadata && user.metadata.creationTime) {
            const creationDate = new Date(user.metadata.creationTime);
            const formattedDate = new Intl.DateTimeFormat('ar-AE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(creationDate);
            
            if (domElements.userCreatedAt) {
                domElements.userCreatedAt.textContent = formattedDate;
            }
        }
        
        // تحديث وقت آخر تسجيل دخول بصيغة نسبية
        if (user.metadata && user.metadata.lastSignInTime) {
            const timeText = formatRelativeTime(user.metadata.lastSignInTime);
            
            if (domElements.lastLoginTime) {
                domElements.lastLoginTime.textContent = timeText;
            }
        }

        // تحديث حالة الأزرار
        if (domElements.requestAccessBtn) {
            domElements.requestAccessBtn.disabled = !user.emailVerified;
        }

        // تحديث حالة طلب الوصول
        checkAccessRequestStatus(user.uid);
    } catch (error) {
        console.error('خطأ في تحديث واجهة المستخدم:', error);
        showStatusMessage('حدث خطأ في تحديث واجهة المستخدم', 'error');
    }
};

// عرض رسائل الحالة للمستخدم
const showStatusMessage = (message, type = 'info') => {
    if (!domElements.requestStatusContainer || !domElements.requestStatus) return;

    domElements.requestStatusContainer.classList.remove('hidden');
    domElements.requestStatus.textContent = message;
    
    // تحديد لون وخلفية الرسالة حسب النوع
    domElements.requestStatusContainer.className = 'mt-6 p-4 rounded-lg';
    
    if (type === 'success') {
        domElements.requestStatusContainer.classList.add('bg-green-50', 'dark:bg-green-900');
        domElements.requestStatus.className = 'text-green-700 dark:text-green-300';
    } else if (type === 'error') {
        domElements.requestStatusContainer.classList.add('bg-red-50', 'dark:bg-red-900');
        domElements.requestStatus.className = 'text-red-700 dark:text-red-300';
    } else { // info or default
        domElements.requestStatusContainer.classList.add('bg-blue-50', 'dark:bg-blue-900');
        domElements.requestStatus.className = 'text-blue-700 dark:text-blue-300';
    }
};

// مراقب حالة المصادقة Firebase
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUserFirebase = user;
        // تحديث واجهة المستخدم وتحميل البيانات
        if (Object.keys(domElements).length > 0) {
            updateUserInterface(user);
            // تحديث حالة التحقق من البريد بشكل مستمر
            const checkEmailVerification = setInterval(() => {
                user.reload().then(() => {
                    if (user.emailVerified) {
                        clearInterval(checkEmailVerification);
                        updateUserInterface(user);
                    }
                });
            }, 5000); // التحقق كل 5 ثواني
        }
    } else {
        window.location.href = 'index.html';
    }
});

// فحص حالة طلب الوصول من Firestore
const checkAccessRequestStatus = (userId) => {
    console.log("فحص حالة طلب الوصول للمستخدم:", userId);

    if (!userId) {
        console.warn("معرف المستخدم غير متوفر.");
        return;
    }

    db.collection('accessRequests')
        .where('userId', '==', userId)
        .orderBy('requestDate', 'desc')
        .limit(1)
        .get()
        .then((querySnapshot) => {
            console.log("هل نتيجة الاستعلام فارغة؟:", querySnapshot.empty);
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const requestData = doc.data();
                console.log("بيانات طلب الوصول:", requestData);
                const requestStatusValue = requestData.status;
                console.log("حالة الطلب من Firestore:", requestStatusValue);

                if (requestStatusValue === 'pending') {
                    showStatusMessage('طلب الوصول قيد المراجعة', 'info');
                    if (domElements.requestAccessBtn) {
                        domElements.requestAccessBtn.disabled = true;
                        domElements.requestAccessBtn.querySelector('span:first-child').textContent = 'تم إرسال الطلب';
                        domElements.requestAccessBtn.classList.add('request-sent-btn');
                    }
                    
                    // تحديث حالة الوصول
                    if (domElements.accessStatusDisplay) {
                        domElements.accessStatusDisplay.innerHTML = 
                            '<span class="badge badge-access">قيد المراجعة</span>';
                    }
                } else if (requestStatusValue === 'approved') {
                    showStatusMessage('تمت الموافقة على الوصول!', 'success');
                    if (domElements.requestAccessBtn) {
                        domElements.requestAccessBtn.disabled = true;
                        domElements.requestAccessBtn.querySelector('span:first-child').textContent = 'تمت الموافقة';
                        domElements.requestAccessBtn.classList.add('request-sent-btn');
                    }
                    
                    // تحديث حالة الوصول
                    if (domElements.accessStatusDisplay) {
                        domElements.accessStatusDisplay.innerHTML = 
                            '<span class="badge badge-verified">تمت الموافقة</span>';
                    }
                } else if (requestStatusValue === 'rejected') {
                    showStatusMessage('تم رفض طلب الوصول.', 'error');
                    if (domElements.requestAccessBtn) {
                        domElements.requestAccessBtn.disabled = false;
                        domElements.requestAccessBtn.querySelector('span:first-child').textContent = 'طلب الوصول إلى NeuroX';
                        domElements.requestAccessBtn.classList.remove('request-sent-btn');
                    }
                    
                    // تحديث حالة الوصول
                    if (domElements.accessStatusDisplay) {
                        domElements.accessStatusDisplay.innerHTML = 
                            '<span class="badge badge-pending">تم الرفض</span>';
                    }
                }
            } else {
                console.log("لم يتم العثور على طلب وصول.");
                if (domElements.accessStatusDisplay) {
                    domElements.accessStatusDisplay.innerHTML = 
                        '<span class="badge">لم يتم تقديم طلب</span>';
                }
            }
        })
        .catch((error) => {
            console.error("خطأ في فحص حالة طلب الوصول:", error);
            showStatusMessage('فشل في التحقق من حالة الطلب.', 'error');
        });
};

// دالة تسجيل الخروج
const handleLogout = () => {
    firebase.auth().signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error("خطأ في تسجيل الخروج:", error);
        alert('حدث خطأ أثناء تسجيل الخروج.');
    });
};

// دالة طلب الوصول إلى NeuroX
const handleRequestAccess = () => {
    if (!domElements.loadingScreen || !domElements.requestAccessBtn) return;

    domElements.loadingScreen.classList.remove('hidden');
    domElements.requestAccessBtn.disabled = true;
    domElements.requestAccessBtn.querySelector('span:first-child').textContent = 'جاري إرسال الطلب...';
    showStatusMessage('جاري إرسال طلب الوصول...', 'info');

    db.collection('accessRequests').add({
        userId: currentUserFirebase.uid,
        email: currentUserFirebase.email,
        requestDate: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'pending' // الحالة الأولية للطلب
    }).then(() => {
        domElements.loadingScreen.classList.add('hidden');
        showStatusMessage('تم إرسال طلب الوصول بنجاح!', 'success');
        domElements.requestAccessBtn.querySelector('span:first-child').textContent = 'تم إرسال الطلب';
        domElements.requestAccessBtn.classList.add('request-sent-btn');
        
        // تحديث حالة الوصول
        if (domElements.accessStatusDisplay) {
            domElements.accessStatusDisplay.innerHTML = 
                '<span class="badge badge-access">قيد المراجعة</span>';
        }
    }).catch((error) => {
        console.error("خطأ في إرسال الطلب:", error);
        domElements.loadingScreen.classList.add('hidden');
        showStatusMessage('فشل إرسال طلب الوصول.', 'error');
        domElements.requestAccessBtn.disabled = false;
        domElements.requestAccessBtn.querySelector('span:first-child').textContent = 'طلب الوصول إلى NeuroX';
        domElements.requestAccessBtn.classList.remove('request-sent-btn');
    });
};

// دالة إعادة إرسال بريد التحقق الإلكتروني
const handleResendVerification = () => {
    if (!domElements.resendVerificationEmail) return;

    domElements.resendVerificationEmail.disabled = true;
    domElements.resendVerificationEmail.textContent = 'جاري الإرسال...';

    currentUserFirebase.sendEmailVerification()
        .then(() => {
            alert('تم إعادة إرسال بريد التحقق بنجاح! يرجى التحقق من بريدك الإلكتروني.');
            domElements.resendVerificationEmail.textContent = 'إعادة إرسال بريد التحقق';
        })
        .catch((error) => {
            console.error("خطأ في إعادة إرسال البريد:", error);
            alert('حدث خطأ أثناء إعادة إرسال بريد التحقق.');
            domElements.resendVerificationEmail.textContent = 'إعادة إرسال بريد التحقق';
        })
        .finally(() => {
            domElements.resendVerificationEmail.disabled = false;
        });
};

// انتظار تحميل DOM بالكامل
document.addEventListener('DOMContentLoaded', () => {
    console.log('تم تحميل DOM بالكامل');
    initializeDOMElements();
    
    // إعادة فرض الثيم بعد تحميل DOM
    console.log('إعادة تطبيق الثيم بعد تحميل DOM:', themeMode);
    applyTheme(themeMode); // تطبيق مباشر للثيم المحفوظ
    
    // التأكد من إضافة مستمع الحدث لزر التبديل
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // إزالة المستمع القديم للتأكد من عدم وجود تكرار
        themeToggle.removeEventListener('click', toggleTheme);
        // إضافة مستمع جديد
        themeToggle.addEventListener('click', toggleTheme);
        console.log('تم إضافة مستمع الحدث لزر تبديل الثيم');
    }
    
    // التأكد من إضافة مستمع الحدث لأيقونة المعلومات
    const infoIcon = document.getElementById('infoIcon');
    if (infoIcon) {
        infoIcon.removeEventListener('click', showInfoModal);
        infoIcon.addEventListener('click', showInfoModal);
        console.log('تم إضافة مستمع الحدث لأيقونة المعلومات');
    }
}); 