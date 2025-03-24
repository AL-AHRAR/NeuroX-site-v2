// استخدام كائنات Firebase من ملف التكوين
// نفترض أن كائنات auth و db معرفة مسبقاً في firebase-config.js

// Authentication Utilities
const authUtils = {
    // Google Sign In
    signInWithGoogle: async () => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await auth.signInWithPopup(provider);
            authUtils.showMessage('تم تسجيل الدخول بنجاح!', 'success');
            // تأخير التحويل للسماح بتحديث واجهة المستخدم أولاً
            setTimeout(() => {
                window.location.href = 'dashboard-simple.html';
            }, 1000);
            return result.user;
        } catch (error) {
            authUtils.showMessage(error.message, 'error');
            throw error;
        }
    },
    showMessage: (message, type = 'info') => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `fixed top-4 right-4 p-4 rounded-lg ${type === 'error' ? 'bg-red-500' : type === 'info' ? 'bg-blue-500' : 'bg-green-500'} text-white z-50 transform transition-all duration-300 opacity-0`;
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.classList.remove('opacity-0'), 100);
        setTimeout(() => {
            alertDiv.classList.add('opacity-0');
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    },
    
    signupUser: async (email, password) => {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            await userCredential.user.sendEmailVerification();
            authUtils.showMessage('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني.', 'success');
            return userCredential.user;
        } catch (error) {
            authUtils.showMessage(error.message, 'error');
            throw error;
        }
    },
    
    loginUser: async (email, password) => {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            authUtils.showMessage('تم تسجيل الدخول بنجاح!', 'success');
            // تأخير التحويل للسماح بتحديث واجهة المستخدم أولاً
            setTimeout(() => {
                window.location.href = 'dashboard-simple.html';
            }, 1000);
            return userCredential.user;
        } catch (error) {
            authUtils.showMessage(error.message, 'error');
            throw error;
        }
    },
    
    resetPassword: async (email) => {
        try {
            await auth.sendPasswordResetEmail(email);
            authUtils.showMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.', 'success');
            document.getElementById('resetPasswordModal').classList.add('hidden');
        } catch (error) {
            authUtils.showMessage(error.message, 'error');
        }
    },

    validateEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    setupPasswordVisibility: () => {
        const togglePasswordBtn = document.querySelector('.toggle-password');
        const passwordInput = document.getElementById('password');
        
        if (togglePasswordBtn && passwordInput) {
            togglePasswordBtn.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                togglePasswordBtn.innerHTML = type === 'password' ? 
                    '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>' :
                    '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>';
            });
        }
    },
    
    // التحقق من حالة المصادقة
    checkAuthState: () => {
        return new Promise((resolve) => {
            auth.onAuthStateChanged((user) => {
                resolve(user);
            });
        });
    }
};

// Password strength checker
const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[!@#$%^&*(),.?":{}|<>]+/)) strength += 1;
    return strength;
};

// Update password strength indicator
const updatePasswordStrength = (password) => {
    const strengthBar = document.querySelector('.password-strength-bar');
    const strengthText = document.querySelector('.password-strength-text');
    const strengthContainer = document.querySelector('.password-strength');
    
    if (!strengthBar || !strengthText || !strengthContainer) return;
    
    const strength = checkPasswordStrength(password);
    let width = '0%';
    let color = 'bg-red-500';
    let text = 'ضعيفة جداً';
    
    switch(strength) {
        case 1:
            width = '20%';
            text = 'ضعيفة';
            break;
        case 2:
            width = '40%';
            color = 'bg-orange-500';
            text = 'متوسطة';
            break;
        case 3:
            width = '60%';
            color = 'bg-yellow-500';
            text = 'جيدة';
            break;
        case 4:
            width = '80%';
            color = 'bg-green-400';
            text = 'قوية';
            break;
        case 5:
            width = '100%';
            color = 'bg-green-500';
            text = 'قوية جداً';
            break;
    }
    
    strengthContainer.classList.remove('hidden');
    strengthBar.className = `password-strength-bar h-full transition-all duration-300 ${color}`;
    strengthBar.style.width = width;
    strengthText.textContent = text;
};

// التعامل مع النافذة المنبثقة للمعلومات حول NeuroX
let mainSignupBtn, betaInfoCard, betaInfoOverlay, closeBetaInfo, betaInfoButtons;

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log("تهيئة عناصر النافذة المنبثقة");
    
    // تهيئة المتغيرات العامة
    mainSignupBtn = document.getElementById('mainSignupBtn');
    betaInfoCard = document.getElementById('betaInfoCard');
    betaInfoOverlay = document.getElementById('betaInfoOverlay');
    closeBetaInfo = document.getElementById('closeBetaInfo');
    betaInfoButtons = document.getElementById('betaInfoButtons');
    
    // إعداد مستمعي الأحداث للنافذة المنبثقة
    setupBetaInfoCardEvents();
    
    // تهيئة القائمة المنسدلة للمستخدم
    setupUserProfileDropdown();
    
    // تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول
    updateHeaderUI();
    updateBetaInfoCardContent();
});

// إعداد مستمعي الأحداث للنافذة المنبثقة
function setupBetaInfoCardEvents() {
    if (mainSignupBtn) {
        console.log("تم العثور على زر ابدأ الآن");
        
        // إزالة أي مستمعي أحداث سابقة
        const newMainSignupBtn = mainSignupBtn.cloneNode(true);
        mainSignupBtn.parentNode.replaceChild(newMainSignupBtn, mainSignupBtn);
        mainSignupBtn = newMainSignupBtn;
        
        mainSignupBtn.addEventListener('click', () => {
            console.log("تم النقر على زر ابدأ الآن");
            
            // التأكد من أن جميع العناصر موجودة
            betaInfoCard = document.getElementById('betaInfoCard');
            betaInfoOverlay = document.getElementById('betaInfoOverlay');
            
            if (!betaInfoCard || !betaInfoOverlay) {
                console.error("النافذة المنبثقة أو الطبقة الشفافة غير موجودة");
                return;
            }
            
            betaInfoCard.classList.add('show');
            betaInfoOverlay.classList.add('show');
            
            // تحديث محتوى النافذة
            updateBetaInfoCardContent();
        });
        
    } else {
        console.warn("لم يتم العثور على زر ابدأ الآن");
    }

    // وظيفة لإغلاق النافذة المنبثقة
    function closeBetaInfoCard() {
        console.log("إغلاق النافذة المنبثقة من الدالة العامة");
        if (betaInfoCard && betaInfoOverlay) {
            betaInfoCard.classList.remove('show');
            betaInfoOverlay.classList.remove('show');
        }
    }

    // إضافة مستمعي الأحداث لأزرار الإغلاق
    if (closeBetaInfo) {
        // إزالة أي مستمعي أحداث سابقة
        const newCloseBetaInfo = closeBetaInfo.cloneNode(true);
        closeBetaInfo.parentNode.replaceChild(newCloseBetaInfo, closeBetaInfo);
        closeBetaInfo = newCloseBetaInfo;
        
        closeBetaInfo.addEventListener('click', closeBetaInfoCard);
    }

    if (betaInfoOverlay) {
        // إزالة أي مستمعي أحداث سابقة
        const newBetaInfoOverlay = betaInfoOverlay.cloneNode(true);
        betaInfoOverlay.parentNode.replaceChild(newBetaInfoOverlay, betaInfoOverlay);
        betaInfoOverlay = newBetaInfoOverlay;
        
        betaInfoOverlay.addEventListener('click', closeBetaInfoCard);
    }
}

// تحديث واجهة الترويسة بناءً على حالة تسجيل الدخول
function updateHeaderUI(currentUser) {
    console.log("Updating header UI with currentUser:", currentUser);
    
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const userProfile = document.querySelector('.user-profile');
    const userNameElement = document.getElementById('userName');
    const mobileMenuAuth = document.querySelector('.mobile-menu-auth');
    const mobileMenuUser = document.querySelector('.mobile-menu-user');
    const userDropdown = document.getElementById('userDropdown');
    const authButtonsLoggedIn = document.querySelector('.auth-buttons-logged-in');
    
    if (!loginBtn || !signupBtn || !userProfile) {
        console.warn("Missing header elements!");
        return;
    }
    
    if (currentUser) {
        // إخفاء أزرار تسجيل الدخول والتسجيل
        document.querySelector('.auth-buttons').classList.add('hidden');
        if (mobileMenuAuth) mobileMenuAuth.classList.add('hidden');
        
        // عرض أزرار لوحة التحكم وتسجيل الخروج
        if (authButtonsLoggedIn) authButtonsLoggedIn.classList.remove('hidden');
        
        // عرض قسم المستخدم
        userProfile.classList.remove('hidden');
        if (mobileMenuUser) mobileMenuUser.classList.remove('hidden');
        
        // تحديث اسم المستخدم
        if (userNameElement) {
            const displayName = currentUser.displayName || 'مستخدم';
            userNameElement.textContent = displayName;
            console.log(`Updated user name to: ${displayName}`);
        }
        
        // إعداد القائمة المنسدلة للمستخدم
        setupUserProfileDropdown();
        console.log("Profile dropdown setup complete");
        
        // إعداد زر تسجيل الخروج في رأس الصفحة
        const logoutHeaderBtn = document.getElementById('logoutHeaderBtn');
        if (logoutHeaderBtn) {
            // إزالة أي مستمعي أحداث سابقة
            const newLogoutHeaderBtn = logoutHeaderBtn.cloneNode(true);
            logoutHeaderBtn.parentNode.replaceChild(newLogoutHeaderBtn, logoutHeaderBtn);
            
            newLogoutHeaderBtn.addEventListener('click', () => {
                auth.signOut().then(() => {
                    console.log('تم تسجيل الخروج بنجاح');
                    updateHeaderUI(null);
                    updateBetaInfoCardContent();
                }).catch((error) => {
                    console.error('خطأ في تسجيل الخروج:', error);
                });
            });
        }
        
        // تحديث المعلومات في localStorage
        localStorage.setItem('userLoggedIn', 'true');
    } else {
        // عرض أزرار تسجيل الدخول والتسجيل
        document.querySelector('.auth-buttons').classList.remove('hidden');
        if (mobileMenuAuth) mobileMenuAuth.classList.remove('hidden');
        
        // إخفاء أزرار لوحة التحكم وتسجيل الخروج
        if (authButtonsLoggedIn) authButtonsLoggedIn.classList.add('hidden');
        
        // إخفاء قسم المستخدم
        userProfile.classList.add('hidden');
        if (mobileMenuUser) mobileMenuUser.classList.add('hidden');
        
        // إزالة المعلومات من localStorage
        localStorage.removeItem('userLoggedIn');
        
        console.log("Showing login/signup buttons");
    }
}

// التحقق من حالة تسجيل الدخول وتحديث محتوى النافذة المنبثقة
function updateBetaInfoCardContent() {
    console.log("تحديث محتوى النافذة المنبثقة");
    
    // التأكد من وجود عنصر betaInfoButtons
    betaInfoButtons = document.getElementById('betaInfoButtons');
    
    if (!betaInfoButtons) {
        console.warn("لم يتم العثور على عنصر betaInfoButtons");
        return; // الخروج مبكراً إذا لم يتم العثور على العنصر
    }
    
    // تحقق مما إذا كان المستخدم مسجل الدخول باستخدام Firebase
    const currentUser = auth.currentUser;
    
    console.log("تحديث الأزرار بناءً على حالة تسجيل الدخول:", currentUser ? "مسجل الدخول" : "غير مسجل الدخول");
    
    // مسح المحتوى السابق وإضافة محتوى جديد
    betaInfoButtons.innerHTML = '';
    
    if (currentUser) {
        // إذا كان المستخدم مسجل الدخول، أظهر زر الوصول إلى لوحة التحكم
        betaInfoButtons.innerHTML = `
            <button class="beta-button beta-button-primary" id="dashboardAccessBtn">
                <i class="fas fa-tachometer-alt"></i>
                الوصول إلى لوحة التحكم
            </button>
            <button class="beta-button beta-button-secondary" id="logoutBtn">
                <i class="fas fa-sign-out-alt"></i>
                تسجيل الخروج
            </button>
        `;
        
        // إضافة مستمعي الأحداث للأزرار بعد إنشائها
        setTimeout(() => {
            const dashboardAccessBtn = document.getElementById('dashboardAccessBtn');
            const logoutBtn = document.getElementById('logoutBtn');
            
            if (dashboardAccessBtn) {
                dashboardAccessBtn.addEventListener('click', () => {
                    window.location.href = 'dashboard-simple.html';
                    closeBetaInfoCard();
                });
            }
            
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    // استخدام Firebase لتسجيل الخروج
                    auth.signOut().then(() => {
                        console.log("تم تسجيل الخروج بنجاح");
                        authUtils.showMessage('تم تسجيل الخروج بنجاح!', 'success');
                        closeBetaInfoCard();
                    }).catch(error => {
                        console.error("خطأ في تسجيل الخروج:", error);
                        authUtils.showMessage('حدث خطأ أثناء تسجيل الخروج.', 'error');
                    });
                });
            }
        }, 50); // استخدام timeout صغير لضمان إضافة العناصر للصفحة أولاً
        
    } else {
        // إذا كان المستخدم غير مسجل الدخول، أظهر أزرار إنشاء حساب وتسجيل الدخول
        betaInfoButtons.innerHTML = `
            <button class="beta-button beta-button-primary" id="betaSignupBtn">
                <i class="fas fa-user-plus"></i>
                إنشاء حساب
            </button>
            <button class="beta-button beta-button-secondary" id="betaLoginBtn">
                <i class="fas fa-sign-in-alt"></i>
                تسجيل الدخول
            </button>
            <button class="beta-button beta-button-google" id="googleSignInBtn">
                <img src="https://www.google.com/favicon.ico" alt="Google">
                التسجيل باستخدام Google
            </button>
        `;
        
        // إضافة مستمعي الأحداث للأزرار بعد إنشائها
        setTimeout(() => {
            const betaSignupBtn = document.getElementById('betaSignupBtn');
            const betaLoginBtn = document.getElementById('betaLoginBtn');
            const googleSignInBtn = document.getElementById('googleSignInBtn');
            
            if (betaSignupBtn) {
                betaSignupBtn.addEventListener('click', () => {
                    // فتح نافذة إنشاء الحساب
                    openSignup();
                    closeBetaInfoCard();
                });
            }
            
            if (betaLoginBtn) {
                betaLoginBtn.addEventListener('click', () => {
                    // فتح نافذة تسجيل الدخول
                    openLogin();
                    closeBetaInfoCard();
                });
            }
            
            if (googleSignInBtn) {
                googleSignInBtn.addEventListener('click', () => {
                    // استخدام Firebase لتسجيل الدخول باستخدام Google
                    authUtils.signInWithGoogle()
                        .then(() => {
                            closeBetaInfoCard();
                        })
                        .catch(error => {
                            console.error("خطأ في تسجيل الدخول بواسطة Google:", error);
                        });
                });
            }
        }, 50); // استخدام timeout صغير لضمان إضافة العناصر للصفحة أولاً
    }
    
    console.log("تم تحديث محتوى النافذة المنبثقة");
}

// إعداد القائمة المنسدلة للمستخدم
function setupUserProfileDropdown() {
    console.log("Setting up profile dropdown...");
    
    const profileButton = document.getElementById('profileButton');
    const userDropdown = document.getElementById('userDropdown');
    const logoutButton = document.getElementById('logoutButton');
    const loginButton = document.getElementById('loginBtn');
    const signupButton = document.getElementById('signupBtn');
    
    if (!profileButton || !userDropdown) {
        console.warn("Missing profile elements!");
        return;
    }
    
    // إزالة أي مستمعي أحداث سابقة عن طريق استنساخ العنصر
    const newProfileButton = profileButton.cloneNode(true);
    profileButton.parentNode.replaceChild(newProfileButton, profileButton);
    
    // أضف مستمع حدث للزر الجديد
    newProfileButton.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log("Profile button clicked!");
        
        // تبديل ظهور القائمة المنسدلة
        userDropdown.classList.toggle('hidden');
        
        // إضافة تأثير انتقالي للقائمة المنسدلة
        if (!userDropdown.classList.contains('hidden')) {
            userDropdown.style.display = 'block';
            // استخدام setTimeout لضمان أن التغيير المرئي يحدث بعد أن يتم تعيين العرض على 'block'
            setTimeout(() => {
                userDropdown.classList.add('active');
            }, 10);
        } else {
            userDropdown.classList.remove('active');
            // إخفاء العنصر بعد انتهاء التأثير الانتقالي
            setTimeout(() => {
                userDropdown.style.display = 'none';
            }, 300);
        }
    });
    
    // إخفاء القائمة المنسدلة عند النقر في أي مكان آخر على الصفحة
    document.addEventListener('click', function(e) {
        if (userDropdown && !userDropdown.classList.contains('hidden') && 
            !newProfileButton.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.add('hidden');
            userDropdown.classList.remove('active');
            setTimeout(() => {
                userDropdown.style.display = 'none';
            }, 300);
        }
    });
    
    if (logoutButton) {
        // إزالة أي مستمعي أحداث سابقة
        const newLogoutButton = logoutButton.cloneNode(true);
        logoutButton.parentNode.replaceChild(newLogoutButton, logoutButton);
        
        newLogoutButton.addEventListener('click', function() {
            console.log("Logout button clicked!");
            firebase.auth().signOut().then(() => {
                toast('success', 'تم تسجيل الخروج بنجاح');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }).catch((error) => {
                toast('error', 'حدث خطأ أثناء تسجيل الخروج');
                console.error('Error signing out: ', error);
            });
        });
    }
    
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            console.log("Login button clicked!");
            showLoginForm();
        });
    }
    
    if (signupButton) {
        signupButton.addEventListener('click', function() {
            console.log("Signup button clicked!");
            showSignupForm();
        });
    }
}

// استمع لتغييرات في حالة تسجيل الدخول
auth.onAuthStateChanged((user) => {
    console.log("تغيير حالة المصادقة:", user ? "مسجل الدخول" : "غير مسجل الدخول");
    
    // تحديث واجهة المستخدم
    updateHeaderUI(user);
    updateBetaInfoCardContent();
    updateMobileAuthUI();
});

// التمرير السلس
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId !== '#' && document.querySelector(targetId)) {
            e.preventDefault();
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// إعدادات العناصر
const authModal = document.getElementById('authModal');
const waitlistModal = document.getElementById('waitlistModal');
const modalTitle = document.getElementById('modalTitle');
const authSubmit = document.getElementById('authSubmit');
const authForm = document.getElementById('authForm');
const closeModal = document.getElementById('closeModal');
const closeWaitlist = document.getElementById('closeWaitlist');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const forgotPasswordBtn = document.getElementById('forgotPassword');
const authContainer = document.getElementById('authContainer');

// حالة المستخدم الحالي
let currentUser = null;
let authState = 'login';

// فتح نافذة تسجيل الدخول
const openLogin = () => {
    authModal.classList.remove('hidden');
    authModal.querySelector('.scale-95').classList.remove('scale-95');
    modalTitle.textContent = 'تسجيل الدخول';
    authSubmit.textContent = 'تسجيل الدخول';
    authState = 'login';
    authForm.reset();
};

// فتح نافذة إنشاء الحساب
const openSignup = () => {
    document.getElementById('signupModal').classList.remove('hidden');
    document.getElementById('signupModal').querySelector('.scale-95').classList.remove('scale-95');
};

// إعداد نافذة إنشاء الحساب
const setupSignupModal = () => {
    const signupModal = document.getElementById('signupModal');
    const closeSignupModal = document.getElementById('closeSignupModal');
    const signupForm = document.getElementById('signupForm');
    const signupPassword = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const signupEmailInput = document.getElementById('signupEmail');
    const usernameInput = document.getElementById('username');
    
    // Add Google Sign-in button to signup form
    const googleSignupBtn = document.createElement('button');
    googleSignupBtn.type = 'button';
    googleSignupBtn.className = 'w-full flex justify-center items-center bg-white text-gray-700 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition mt-4';
    googleSignupBtn.innerHTML = `
        <img src="https://www.google.com/favicon.ico" class="w-5 h-5 mr-2" alt="Google logo">
        التسجيل باستخدام Google
    `;
    googleSignupBtn.addEventListener('click', async () => {
        try {
            await authUtils.signInWithGoogle();
            signupModal.classList.add('hidden');
            // تحديث واجهة المستخدم بعد نجاح تسجيل الدخول
            updateHeaderUI();
            updateBetaInfoCardContent();
        } catch (error) {
            console.error('Google sign-in error:', error);
            authUtils.showMessage(error.message, 'error');
        }
    });
    
    if (signupForm && !signupForm.querySelector('.google-signup-btn')) {
        signupForm.appendChild(googleSignupBtn);
        googleSignupBtn.classList.add('google-signup-btn');
    }
    
    // Setup password visibility toggle
    const togglePasswordBtns = signupModal.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            btn.innerHTML = type === 'password' ? 
                '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>' :
                '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>';
        });
    });

    // Password strength check
    if (signupPassword) {
        signupPassword.addEventListener('input', () => {
            updatePasswordStrength(signupPassword.value);
        });
    }

    // Close modal
    if (closeSignupModal) {
        closeSignupModal.addEventListener('click', () => {
            signupModal.classList.add('hidden');
            signupForm.reset();
        });
    }

    // Handle form submission
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = signupEmailInput.value.trim();
            const password = signupPassword.value.trim();
            const confirmPwd = confirmPassword.value.trim();
            const username = usernameInput.value.trim();

            if (!username) {
                authUtils.showMessage('يرجى إدخال اسم المستخدم.', 'error');
                return;
            }

            if (password !== confirmPwd) {
                authUtils.showMessage('كلمات المرور غير متطابقة.', 'error');
                return;
            }

            if (checkPasswordStrength(password) < 3) {
                authUtils.showMessage('يرجى اختيار كلمة مرور أقوى.', 'error');
                return;
            }

            try {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                await userCredential.user.updateProfile({
                    displayName: username
                });
                await userCredential.user.sendEmailVerification();
                signupModal.classList.add('hidden');
                signupForm.reset();
                authUtils.showMessage('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني.', 'success');
                
                // تحديث واجهة المستخدم بعد إنشاء الحساب
                updateHeaderUI();
                updateBetaInfoCardContent();
            } catch (error) {
                authUtils.showMessage(error.message, 'error');
            }
        });
    }
};

// Initialize signup modal
setupSignupModal();

// إغلاق النوافذ
if (closeModal) {
    closeModal.addEventListener('click', () => {
        authModal.classList.add('hidden');
        authForm.reset();
    });
}

if (closeWaitlist) {
    closeWaitlist.addEventListener('click', () => {
        waitlistModal.classList.add('hidden');
    });
}

// معالجة نسيان كلمة المرور
if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', () => {
        const email = emailInput.value.trim();
        if (!email) {
            authUtils.showMessage('يرجى إدخال البريد الإلكتروني لإعادة تعيين كلمة المرور.', 'error');
            return;
        }
        authUtils.resetPassword(email);
    });
}

// إدارة عمليات تسجيل الدخول وإنشاء الحساب
if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            authUtils.showMessage('يرجى إدخال البريد الإلكتروني وكلمة المرور.', 'error');
            return;
        }

        try {
            if (authState === 'signup') {
                await authUtils.signupUser(email, password);
                authState = 'login';
                modalTitle.textContent = 'تسجيل الدخول';
                authSubmit.textContent = 'تسجيل الدخول';
                authForm.reset();
            } else {
                await authUtils.loginUser(email, password);
                authModal.classList.add('hidden');
                authForm.reset();
                
                // تحديث واجهة المستخدم بعد تسجيل الدخول
                // (لا حاجة للاستدعاء المباشر هنا لأن مراقب حالة المصادقة سيعالج ذلك)
            }
        } catch (error) {
            console.error('Authentication error:', error);
            authUtils.showMessage(error.message, 'error');
        }
    });
}

// تحديث واجهة المستخدم
const updateAuthUI = () => {
    const authContainer = document.getElementById('authContainer');
    if (!authContainer) {
        console.warn('عنصر authContainer غير موجود في الصفحة');
        return;
    }
    
    console.log("تحديث واجهة المستخدم الرئيسية...");
    authContainer.innerHTML = '';
    
    // استخدام Firebase للتحقق من حالة تسجيل الدخول
    const user = auth.currentUser;
    // تحديث المتغير العالمي currentUser بقيمة المستخدم الحالي
    currentUser = user;
    
    if (user) {
        // منطق المستخدم المسجل
        authContainer.innerHTML = `
            <button id="dashboardBtn" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition transform hover:scale-105 mr-4 hover:shadow-lg">لوحة التحكم</button>
            <button id="logoutBtn" class="text-blue-400 hover:text-blue-500 transition flex items-center">
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                تسجيل الخروج
            </button>
        `;
        document.getElementById('dashboardBtn').addEventListener('click', () => window.location.href = 'dashboard-simple.html');
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                auth.signOut().then(() => {
                    // تحديث المتغيرات العالمية
                    currentUser = null;
                    sessionStorage.removeItem('currentUser');
                    
                    // تحديث واجهات المستخدم
                    updateAuthUI();
                    updateMobileAuthUI();
                    
                    // عرض رسالة للمستخدم
                    authUtils.showMessage('تم تسجيل الخروج بنجاح!', 'success');
                }).catch((error) => {
                    console.error("خطأ في تسجيل الخروج:", error);
                    authUtils.showMessage('حدث خطأ أثناء تسجيل الخروج.', 'error');
                });
            });
        }
    } else {
        // منطق المستخدم غير المسجل
        authContainer.innerHTML = `
            <button id="loginBtn" class="flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg dark:text-blue-300 text-blue-600 dark:hover:bg-gray-700 hover:bg-gray-100 border-2 dark:border-blue-500/40 border-blue-400/40 group ml-2">
                <svg class="w-4 h-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-[-2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14"></path>
                </svg>
                <span>تسجيل الدخول</span>
            </button>
            <button id="signupBtn" class="flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-300 bg-gradient-to-r dark:from-blue-600 dark:to-blue-500 from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:scale-105">
                <span>إنشاء حساب</span>
                <svg class="w-4 h-4 mr-1.5 transition-transform duration-300 group-hover:translate-x-[2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
            </button>
        `;
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        
        if (loginBtn) loginBtn.addEventListener('click', openLogin);
        if (signupBtn) signupBtn.addEventListener('click', openSignup);
    }
    
    console.log("تم تحديث واجهة المستخدم الرئيسية بنجاح");
    
    // تحديث القائمة الجانبية المحمولة عند تحديث حالة المصادقة
    updateMobileAuthUI();
};

// تحديث واجهة القائمة الجانبية المحمولة
const updateMobileAuthUI = () => {
    const mobileAuthContainer = document.getElementById('mobileAuthContainer');
    if (!mobileAuthContainer) {
        console.warn('عنصر mobileAuthContainer غير موجود في الصفحة');
        return;
    }
    
    console.log("تحديث واجهة القائمة الجانبية المحمولة...");
    mobileAuthContainer.innerHTML = '';
    
    // استخدام Firebase للتحقق من حالة تسجيل الدخول
    const user = auth.currentUser;
    
    if (user) {
        // عرض أزرار لوحة التحكم وتسجيل الخروج للمستخدمين المسجلين
        mobileAuthContainer.innerHTML = `
            <div class="flex flex-col space-y-3">
                <a href="dashboard-simple.html" class="py-3 px-4 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition flex items-center justify-center">
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                    </svg>
                    لوحة التحكم
                </a>
                <button id="mobileLogoutBtn" class="py-3 px-4 bg-transparent border border-red-500 text-red-500 rounded-lg text-center hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center justify-center">
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    تسجيل الخروج
                </button>
            </div>
        `;
        
        // إضافة مستمع حدث لزر تسجيل الخروج في القائمة الجانبية
        const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
        if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener('click', () => {
                auth.signOut().then(() => {
                    authUtils.showMessage('تم تسجيل الخروج بنجاح!', 'success');
                    
                    // إغلاق القائمة المحمولة بعد تسجيل الخروج
                    const mobileMenu = document.getElementById('mobileMenu');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        document.getElementById('mobileMenuBtn').click();
                    }
                }).catch((error) => {
                    console.error("خطأ في تسجيل الخروج:", error);
                    authUtils.showMessage('حدث خطأ أثناء تسجيل الخروج.', 'error');
                });
            });
        }
    } else {
        // عرض أزرار تسجيل الدخول وإنشاء الحساب للزوار
        mobileAuthContainer.innerHTML = `
            <div class="flex flex-col space-y-3">
                <button id="mobileLoginBtn" class="py-3 px-4 bg-transparent border border-blue-500 text-blue-500 rounded-lg text-center hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
                    تسجيل الدخول
                </button>
                <button id="mobileSignupBtn" class="py-3 px-4 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition">
                    إنشاء حساب
                </button>
            </div>
        `;
        
        // إضافة مستمعي الأحداث لأزرار تسجيل الدخول وإنشاء الحساب
        document.getElementById('mobileLoginBtn').addEventListener('click', () => {
            // إغلاق القائمة المحمولة
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                document.getElementById('mobileMenuBtn').click();
            }
            openLogin();
        });
        
        document.getElementById('mobileSignupBtn').addEventListener('click', () => {
            // إغلاق القائمة المحمولة
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                document.getElementById('mobileMenuBtn').click();
            }
            openSignup();
        });
    }
    
    console.log("تم تحديث واجهة القائمة الجانبية المحمولة بنجاح");
};

// Scroll to Top Button Functionality
const scrollToTopBtn = document.getElementById('scrollToTop');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.remove('hidden', 'opacity-0');
    } else {
        scrollToTopBtn.classList.add('opacity-0');
        setTimeout(() => scrollToTopBtn.classList.add('hidden'), 300);
    }
});
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Help Icon and Request Status Functionality
const helpIcon = document.getElementById('helpIcon');
const requestStatus = document.getElementById('requestStatus');
helpIcon.addEventListener('click', () => {
    requestStatus.classList.toggle('hidden');
});

// Close request status when clicking outside
document.addEventListener('click', (e) => {
    if (!helpIcon.contains(e.target) && !requestStatus.contains(e.target)) {
        requestStatus.classList.add('hidden');
    }
});

// إضافة معالجات أحداث لأزرار الدعوة للعمل
document.addEventListener('DOMContentLoaded', () => {
    const ctaSignupBtn = document.getElementById('ctaSignupBtn');
    const ctaLearnMoreBtn = document.getElementById('ctaLearnMoreBtn');
    
    if (ctaSignupBtn) {
        ctaSignupBtn.addEventListener('click', () => {
            if (auth.currentUser) {
                // إذا كان المستخدم مسجل الدخول بالفعل، انتقل إلى لوحة التحكم
                window.location.href = 'dashboard-simple.html';
            } else {
                // إذا لم يكن المستخدم مسجل الدخول، افتح نافذة تسجيل الدخول
                if (typeof openLogin === 'function') {
                    openLogin();
                } else {
                    // إظهار النافذة المنبثقة البديلة
                    const betaInfoCard = document.getElementById('betaInfoCard');
                    const betaInfoOverlay = document.getElementById('betaInfoOverlay');
                    if (betaInfoCard && betaInfoOverlay) {
                        betaInfoCard.classList.add('show');
                        betaInfoOverlay.classList.add('show');
                        updateBetaInfoCardContent();
                    }
                }
            }
        });
    }
    
    if (ctaLearnMoreBtn) {
        ctaLearnMoreBtn.addEventListener('click', () => {
            window.location.href = 'about-neurox.html';
        });
    }
});

// Function to setup mobile menu
function setupMobileMenu() {
    console.log("إعداد القائمة المحمولة...");
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuContent = document.getElementById('menuContent');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    
    // تأكد من وجود العناصر الضرورية
    if (!mobileMenuBtn) {
        console.error("خطأ: زر القائمة المحمولة (mobileMenuBtn) غير موجود!");
        return;
    }
    
    if (!mobileMenu) {
        console.error("خطأ: القائمة المحمولة (mobileMenu) غير موجودة!");
        return;
    }
    
    if (!menuContent) {
        console.error("خطأ: محتوى القائمة (menuContent) غير موجود!");
        return;
    }
    
    if (!menuOverlay) {
        console.error("خطأ: خلفية القائمة (menuOverlay) غير موجودة!");
        return;
    }
    
    // وظيفة فتح القائمة
    function openMenu() {
        console.log("فتح القائمة المحمولة...");
        try {
            // إظهار القائمة
            mobileMenu.classList.remove('hidden');
            
            // إضافة فئة النشاط للزر
            mobileMenuBtn.classList.add('active');
            
            // إضافة تأخير بسيط للحركة
            setTimeout(() => {
                mobileMenu.classList.add('active');
                
                // ضبط أسلوب التحويل والشفافية مباشرة باستخدام JavaScript
                if (menuContent) {
                    menuContent.style.transform = 'translateY(0)';
                    menuContent.style.opacity = '1';
                }
                
                // منع التمرير عند فتح القائمة
                document.body.style.overflow = 'hidden';
            }, 10);
        } catch (error) {
            console.error("خطأ عند فتح القائمة:", error);
        }
    }
    
    // وظيفة إغلاق القائمة
    function closeMenu() {
        console.log("إغلاق القائمة المحمولة...");
        try {
            // إزالة فئة النشاط من الزر
            mobileMenuBtn.classList.remove('active');
            
            // ضبط أسلوب التحويل والشفافية للإغلاق
            if (menuContent) {
                menuContent.style.transform = 'translateY(-20px)';
                menuContent.style.opacity = '0';
            }
            
            // إضافة تأخير للإغلاق التدريجي
            setTimeout(() => {
                mobileMenu.classList.remove('active');
                mobileMenu.classList.add('hidden');
                
                // إعادة تمكين التمرير
                document.body.style.overflow = '';
            }, 300);
        } catch (error) {
            console.error("خطأ عند إغلاق القائمة:", error);
        }
    }
    
    // وظيفة تبديل القائمة (فتح/إغلاق)
    function toggleMenu() {
        console.log("تبديل حالة القائمة المحمولة...");
        try {
            // التحقق من حالة القائمة
            const isOpen = mobileMenu.classList.contains('active');
            
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        } catch (error) {
            console.error("خطأ عند تبديل القائمة:", error);
        }
    }
    
    // إضافة مستمعي الأحداث
    console.log("إضافة مستمعي الأحداث للقائمة المحمولة...");
    
    mobileMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
        });
    }
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
        });
    }
    
    // إغلاق القائمة عند النقر على الروابط
    const hashLinks = document.querySelectorAll('#mobileMenu a[href^="#"]');
    hashLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });
    
    // إغلاق القائمة عند تغيير حجم النافذة
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) { // 768px تطابق نقطة md في Tailwind
            closeMenu();
        }
    });
    
    // إغلاق القائمة عند التمرير لأسفل
    window.addEventListener('scroll', function() {
        if (mobileMenu.classList.contains('active') && window.scrollY > 100) {
            closeMenu();
        }
    });
    
    console.log("تم إعداد القائمة المحمولة بنجاح!");
}

// Function to setup theme toggle
function setupThemeToggle() {
    console.log("إعداد زر تبديل الثيم...");
    
    const htmlElement = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    
    // التحقق من وجود الأزرار
    if (!themeToggle && !mobileThemeToggle) {
        console.error("خطأ: أزرار تبديل الثيم غير موجودة!");
        return;
    }
    
    // التحقق من تفضيلات المستخدم المخزنة أو إعدادات النظام
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    
    // تطبيق الثيم المناسب
    if (storedTheme === 'dark' || (!storedTheme && userPrefersDark)) {
        htmlElement.classList.add('dark');
        console.log("تطبيق الثيم المظلم");
    } else if (storedTheme === 'light') {
        htmlElement.classList.remove('dark');
        console.log("تطبيق الثيم الفاتح");
    }
    
    // تحديث مظهر زر التبديل المحمول حسب الثيم الحالي
    updateThemeToggleState();
    
    // وظيفة تبديل الثيم
    function toggleTheme() {
        console.log("تبديل الثيم...");
        try {
            if (htmlElement.classList.contains('dark')) {
                htmlElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                console.log("تم التبديل إلى الثيم الفاتح");
            } else {
                htmlElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                console.log("تم التبديل إلى الثيم المظلم");
            }
            
            // تحديث مظهر زر التبديل بعد تغيير الثيم
            updateThemeToggleState();
        } catch (error) {
            console.error("خطأ عند تبديل الثيم:", error);
        }
    }
    
    // وظيفة تحديث مظهر زر التبديل
    function updateThemeToggleState() {
        const isDark = htmlElement.classList.contains('dark');
        if (mobileThemeToggle) {
            const toggleDot = mobileThemeToggle.querySelector('span');
            if (toggleDot) {
                if (isDark) {
                    toggleDot.style.left = '1.75rem'; // تحريك النقطة إلى اليمين في وضع الظلام
                } else {
                    toggleDot.style.left = '0.25rem'; // تحريك النقطة إلى اليسار في وضع الضوء
                }
            }
            
            // تحديث ألوان الخلفية
            if (isDark) {
                mobileThemeToggle.classList.add('dark-mode');
                mobileThemeToggle.classList.remove('light-mode');
            } else {
                mobileThemeToggle.classList.add('light-mode');
                mobileThemeToggle.classList.remove('dark-mode');
            }
        }
    }
    
    // إضافة مستمعي الأحداث
    if (themeToggle) {
        // التأكد من إزالة أي مستمعي أحداث سابقة
        const oldThemeToggle = themeToggle.cloneNode(true);
        themeToggle.parentNode.replaceChild(oldThemeToggle, themeToggle);
        
        // إضافة مستمع حدث جديد
        oldThemeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleTheme();
        });
        console.log("تم إضافة مستمع الحدث لزر تبديل الثيم الرئيسي");
    }
    
    if (mobileThemeToggle) {
        // التأكد من إزالة أي مستمعي أحداث سابقة
        const oldMobileThemeToggle = mobileThemeToggle.cloneNode(true);
        mobileThemeToggle.parentNode.replaceChild(oldMobileThemeToggle, mobileThemeToggle);
        
        // إضافة مستمع حدث جديد
        oldMobileThemeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleTheme();
        });
        console.log("تم إضافة مستمع الحدث لزر تبديل الثيم في القائمة المحمولة");
    }
    
    console.log("تم إعداد زر تبديل الثيم بنجاح!");
}

// When DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM content loaded");
    
    // تهيئة عناصر النافذة المنبثقة
    console.log("تهيئة عناصر النافذة المنبثقة");
    
    // تهيئة المتغيرات العامة
    mainSignupBtn = document.getElementById('mainSignupBtn');
    betaInfoCard = document.getElementById('betaInfoCard');
    betaInfoOverlay = document.getElementById('betaInfoOverlay');
    closeBetaInfo = document.getElementById('closeBetaInfo');
    betaInfoButtons = document.getElementById('betaInfoButtons');
    
    // إعداد مستمعي الأحداث للنافذة المنبثقة
    setupBetaInfoCardEvents();
    
    // تهيئة القائمة المنسدلة للمستخدم
    setupUserProfileDropdown();
    
    // تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول
    updateHeaderUI();
    updateBetaInfoCardContent();
    
    // Setup theme toggle and mobile menu
    setupThemeToggle();
    setupMobileMenu();
    
    // تحديث حالة أزرار تبديل الثيم مباشرة عند تحميل الصفحة
    updateThemeToggleState();
    
    // مراقبة تغيير تفضيلات الثيم في النظام
    if (window.matchMedia) {
        const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)');
        prefersColorScheme.addEventListener('change', function(e) {
            if (!localStorage.getItem('theme')) {
                document.documentElement.classList.toggle('dark', e.matches);
                updateThemeToggleState();
            }
        });
    }
    
    // أزرار CTA
    const ctaSignupBtn = document.getElementById('ctaSignupBtn');
    const ctaLearnMoreBtn = document.getElementById('ctaLearnMoreBtn');
    
    if (ctaSignupBtn) {
        ctaSignupBtn.addEventListener('click', () => {
            if (auth.currentUser) {
                // إذا كان المستخدم مسجل الدخول بالفعل، انتقل إلى لوحة التحكم
                window.location.href = 'dashboard-simple.html';
            } else {
                // إذا لم يكن المستخدم مسجل الدخول، افتح نافذة تسجيل الدخول
                if (typeof openLogin === 'function') {
                    openLogin();
                } else {
                    // إظهار النافذة المنبثقة البديلة
                    const betaInfoCard = document.getElementById('betaInfoCard');
                    const betaInfoOverlay = document.getElementById('betaInfoOverlay');
                    if (betaInfoCard && betaInfoOverlay) {
                        betaInfoCard.classList.add('show');
                        betaInfoOverlay.classList.add('show');
                        updateBetaInfoCardContent();
                    }
                }
            }
        });
    }
    
    if (ctaLearnMoreBtn) {
        ctaLearnMoreBtn.addEventListener('click', () => {
            window.location.href = 'about-neurox.html';
        });
    }
    
    // إضافة مستمعي أحداث ديناميكية لحقول الإدخال
    const emailInputs = document.querySelectorAll('input[type="email"]');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    emailInputs.forEach(input => {
        input.addEventListener('focus', () => input.classList.add('ring-2', 'ring-blue-500'));
        input.addEventListener('blur', () => input.classList.remove('ring-2', 'ring-blue-500'));
    });
    
    passwordInputs.forEach(input => {
        input.addEventListener('focus', () => input.classList.add('ring-2', 'ring-blue-500'));
        input.addEventListener('blur', () => input.classList.remove('ring-2', 'ring-blue-500'));
    });
});

// وظيفة لتحديث حالة أزرار تبديل الثيم حسب الحالة الحالية
function updateThemeToggleState() {
    const isDark = document.documentElement.classList.contains('dark');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    
    if (mobileThemeToggle) {
        const toggleDot = mobileThemeToggle.querySelector('span');
        if (toggleDot) {
            if (isDark) {
                toggleDot.style.left = '1.75rem'; // تحريك النقطة إلى اليمين في وضع الظلام
                mobileThemeToggle.classList.add('dark-mode');
                mobileThemeToggle.classList.remove('light-mode');
            } else {
                toggleDot.style.left = '0.25rem'; // تحريك النقطة إلى اليسار في وضع الضوء
                mobileThemeToggle.classList.add('light-mode');
                mobileThemeToggle.classList.remove('dark-mode');
            }
        }
    }
}