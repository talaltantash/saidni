import React, { createContext, useContext, useState } from 'react';

export const translations = {
  ar: {
    appName: 'ساعدني',
    tagline: 'منصة الخدمات الموثوقة',
    heroTitle: 'ساعدني في إيجاد من أحتاجه',
    heroSubtitle: 'متخصصون مؤهلون في حيك',
    categories: {
      'سباكة': 'سباكة',
      'كهرباء': 'كهرباء',
      'تكييف': 'تكييف و تهوية',
      'نجارة': 'نجارة',
      'دهانات': 'دهانات',
      'تنظيف': 'تنظيف',
      'صيانة مسابح': 'صيانة مسابح',
      'صيانة عامة': 'صيانة عامة'
    },
    locations: {
      'عمّان - الشميساني': 'عمّان - الشميساني',
      'عمّان - دابوق': 'عمّان - دابوق',
      'عمّان - الدوار السابع': 'عمّان - الدوار السابع',
      'عمّان - العبدلي': 'عمّان - العبدلي',
      'عمّان - الرابية': 'عمّان - الرابية',
      'عمّان - خلدا': 'عمّان - خلدا',
      'عمّان - الجاردنز': 'عمّان - الجاردنز',
      'عمّان - مرج الحمام': 'عمّان - مرج الحمام',
      'عمّان - صويلح': 'عمّان - صويلح',
      'عمّان - الجبيهة': 'عمّان - الجبيهة',
      'عمّان - تلاع العلي': 'عمّان - تلاع العلي',
      'عمّان - أبو نصير': 'عمّان - أبو نصير',
      'عمّان - ماركا': 'عمّان - ماركا',
      'الزرقاء': 'الزرقاء',
      'إربد': 'إربد',
      'العقبة': 'العقبة',
      'السلط': 'السلط'
    },
    nav: {
      home: 'الرئيسية',
      browse: 'البحث عن مزودي الخدمات',
      myBookings: 'حجوزاتي',
      dashboard: 'لوحة التحكم',
      admin: 'الإدارة',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      registerCustomer: 'تسجيل كعميل',
      registerWorker: 'تسجيل كمزود خدمة'
    },
    home: {
      howItWorks: 'كيف تعمل ساعدني',
      step1Title: 'ابحث عمّن تحتاجه',
      step1Desc: 'اختر الخدمة والمنطقة واعثر على الشخص المناسب',
      step2Title: 'تواصل مباشرة',
      step2Desc: 'تحدث معهم على WhatsApp أو حجز خدماتهم',
      step3Title: 'قيّم الخدمة',
      step3Desc: 'اترك تقييماً وساعد الآخرين',
      trustBadges: 'ميزات موثوقة',
      vtcVerified: 'معتمدين من هيئة المرور',
      ratedByNeighbors: 'مقيمين من الجيران',
      instantWhatsapp: 'تواصل فوري عبر WhatsApp'
    },
    browse: {
      title: 'البحث عن مزودي الخدمات',
      filterCategory: 'الفئة',
      filterLocation: 'المنطقة',
      filterRating: 'الحد الأدنى للتقييم',
      search: 'بحث باسم أو وصف',
      noWorkers: 'لم يتم العثور على مزودي خدمات',
      loading: 'جاري التحميل...'
    },
    worker: {
      profile: 'الملف الشخصي',
      years: 'سنوات الخبرة',
      rating: 'التقييم',
      reviews: 'التقييمات',
      noReviews: 'لا توجد تقييمات حتى الآن',
      verified: 'موثق',
      available: 'متاح الآن',
      unavailable: 'غير متاح حالياً',
      whatsapp: 'تواصل عبر WhatsApp',
      leaveReview: 'اترك تقييماً',
      yourRating: 'تقييمك',
      yourComment: 'تعليقك',
      submitReview: 'إرسال التقييم',
      loginToReview: 'يجب تسجيل الدخول لترك تقييم',
      pending: 'قيد المراجعة'
    },
    auth: {
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب جديد',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      name: 'الاسم',
      phone: 'رقم الهاتف',
      noAccount: 'ليس لديك حساب؟',
      haveAccount: 'هل لديك حساب بالفعل؟',
      registerAsCustomer: 'تسجيل كعميل',
      registerAsWorker: 'تسجيل كمزود خدمة',
      backToLogin: 'العودة لتسجيل الدخول'
    },
    worker_form: {
      category: 'التخصص',
      location: 'المنطقة',
      experience: 'سنوات الخبرة',
      bio: 'نبذة عنك',
      whatsappNumber: 'رقم WhatsApp',
      vtcLicense: 'رقم ترخيص هيئة المرور',
      reviewNote: 'سيتم مراجعة طلبك من قِبَل فريقنا قبل نشر ملفك الشخصي',
      selectCategory: 'اختر التخصص',
      selectLocation: 'اختر المنطقة',
      enterExperience: 'أدخل سنوات الخبرة'
    },
    bookings: {
      myBookings: 'حجوزاتي',
      noBookings: 'لا توجد حجوزات',
      newBooking: 'حجز جديد',
      serviceDescription: 'وصف الخدمة',
      createBooking: 'حجز الخدمة',
      pending: 'قيد الانتظار',
      accepted: 'مقبول',
      completed: 'مكتمل',
      cancelled: 'ملغى'
    },
    dashboard: {
      workerDashboard: 'لوحة التحكم',
      profileSummary: 'ملخص الملف الشخصي',
      verificationStatus: 'حالة التحقق',
      verified: 'موثق',
      pending: 'قيد المراجعة',
      rejected: 'مرفوض',
      recentBookings: 'الحجوزات الأخيرة',
      availability: 'متاح الآن',
      markAvailable: 'متاح',
      markUnavailable: 'غير متاح'
    },
    admin: {
      adminPanel: 'لوحة الإدارة',
      pending: 'قيد المراجعة',
      verified: 'الموثقين',
      rejected: 'المرفوضين',
      name: 'الاسم',
      category: 'التخصص',
      location: 'المنطقة',
      vtcNumber: 'رقم هيئة المرور',
      registrationDate: 'تاريخ التسجيل',
      approve: 'موافقة',
      reject: 'رفض',
      noWorkers: 'لا يوجد مزودو خدمات'
    },
    messages: {
      success: 'تم بنجاح',
      error: 'حدث خطأ',
      loading: 'جاري التحميل...',
      requiredField: 'هذا الحقل مطلوب',
      invalidEmail: 'البريد الإلكتروني غير صحيح',
      passwordMismatch: 'كلمات المرور غير متطابقة',
      emailExists: 'هذا البريد مسجل بالفعل',
      invalidCredentials: 'البريد أو كلمة المرور غير صحيحة',
      unauthorized: 'غير مصرح لك بهذا الإجراء',
      notFound: 'لم يتم العثور على البيانات'
    }
  },
  en: {
    appName: 'Sa3idni',
    tagline: 'Trusted Tradespeople Platform',
    heroTitle: 'Find Your Trusted Craftsman',
    heroSubtitle: 'Verified professionals in your neighborhood',
    categories: {
      'سباكة': 'Plumbing',
      'كهرباء': 'Electrical',
      'تكييف': 'AC & HVAC',
      'نجارة': 'Carpentry',
      'دهانات': 'Painting',
      'تنظيف': 'Cleaning',
      'صيانة مسابح': 'Pool Maintenance',
      'صيانة عامة': 'General Maintenance'
    },
    locations: {
      'عمّان - الشميساني': 'Amman - Shmeisani',
      'عمّان - دابوق': 'Amman - Dabbouq',
      'عمّان - الدوار السابع': 'Amman - Seventh Circle',
      'عمّان - العبدلي': 'Amman - Abdali',
      'عمّان - الرابية': 'Amman - Al-Rabiah',
      'عمّان - خلدا': 'Amman - Khalda',
      'عمّان - الجاردنز': 'Amman - Gardens',
      'عمّان - مرج الحمام': 'Amman - Marg Al-Hamam',
      'عمّان - صويلح': 'Amman - Sweifieh',
      'عمّان - الجبيهة': 'Amman - Al-Jubeiha',
      'عمّان - تلاع العلي': 'Amman - Tala Al-Ali',
      'عمّان - أبو نصير': 'Amman - Abu Nseir',
      'عمّان - ماركا': 'Amman - Marka',
      'الزرقاء': 'Zarqa',
      'إربد': 'Irbid',
      'العقبة': 'Aqaba',
      'السلط': 'Salt'
    },
    nav: {
      home: 'Home',
      browse: 'Browse Workers',
      myBookings: 'My Bookings',
      dashboard: 'Dashboard',
      admin: 'Admin Panel',
      login: 'Login',
      logout: 'Logout',
      registerCustomer: 'Register as Customer',
      registerWorker: 'Register as Worker'
    },
    home: {
      howItWorks: 'How It Works',
      step1Title: 'Find Your Craftsman',
      step1Desc: 'Choose the service and location, find the right professional',
      step2Title: 'Contact Directly',
      step2Desc: 'Chat on WhatsApp or book their services',
      step3Title: 'Rate the Service',
      step3Desc: 'Leave a review and help others',
      trustBadges: 'Why Trust Us',
      vtcVerified: 'VTC Verified',
      ratedByNeighbors: 'Rated by Neighbors',
      instantWhatsapp: 'Instant WhatsApp Contact'
    },
    browse: {
      title: 'Browse Workers',
      filterCategory: 'Category',
      filterLocation: 'Location',
      filterRating: 'Minimum Rating',
      search: 'Search by name or description',
      noWorkers: 'No workers found',
      loading: 'Loading...'
    },
    worker: {
      profile: 'Profile',
      years: 'Years of Experience',
      rating: 'Rating',
      reviews: 'Reviews',
      noReviews: 'No reviews yet',
      verified: 'Verified',
      available: 'Available Now',
      unavailable: 'Unavailable',
      whatsapp: 'Contact on WhatsApp',
      leaveReview: 'Leave a Review',
      yourRating: 'Your Rating',
      yourComment: 'Your Comment',
      submitReview: 'Submit Review',
      loginToReview: 'You must be logged in to leave a review',
      pending: 'Pending Verification'
    },
    auth: {
      login: 'Login',
      register: 'Create New Account',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      name: 'Name',
      phone: 'Phone Number',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      registerAsCustomer: 'Register as Customer',
      registerAsWorker: 'Register as Worker',
      backToLogin: 'Back to Login'
    },
    worker_form: {
      category: 'Trade Category',
      location: 'Location',
      experience: 'Years of Experience',
      bio: 'Tell us about yourself',
      whatsappNumber: 'WhatsApp Number',
      vtcLicense: 'VTC License Number',
      reviewNote: 'Your application will be reviewed before your profile goes live',
      selectCategory: 'Select a category',
      selectLocation: 'Select a location',
      enterExperience: 'Enter years of experience'
    },
    bookings: {
      myBookings: 'My Bookings',
      noBookings: 'No bookings yet',
      newBooking: 'New Booking',
      serviceDescription: 'Service Description',
      createBooking: 'Create Booking',
      pending: 'Pending',
      accepted: 'Accepted',
      completed: 'Completed',
      cancelled: 'Cancelled'
    },
    dashboard: {
      workerDashboard: 'Worker Dashboard',
      profileSummary: 'Profile Summary',
      verificationStatus: 'Verification Status',
      verified: 'Verified',
      pending: 'Pending',
      rejected: 'Rejected',
      recentBookings: 'Recent Bookings',
      availability: 'Availability',
      markAvailable: 'Mark Available',
      markUnavailable: 'Mark Unavailable'
    },
    admin: {
      adminPanel: 'Admin Panel',
      pending: 'Pending',
      verified: 'Verified',
      rejected: 'Rejected',
      name: 'Name',
      category: 'Category',
      location: 'Location',
      vtcNumber: 'VTC Number',
      registrationDate: 'Registration Date',
      approve: 'Approve',
      reject: 'Reject',
      noWorkers: 'No workers found'
    },
    messages: {
      success: 'Success',
      error: 'An error occurred',
      loading: 'Loading...',
      requiredField: 'This field is required',
      invalidEmail: 'Invalid email address',
      passwordMismatch: 'Passwords do not match',
      emailExists: 'Email already registered',
      invalidCredentials: 'Invalid email or password',
      unauthorized: 'You are not authorized for this action',
      notFound: 'Data not found'
    }
  }
};

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState('ar');

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[lang];
    for (let k of keys) {
      value = value[k];
      if (!value) return key;
    }
    return value;
  };

  const toggleLang = () => {
    setLang(prev => prev === 'ar' ? 'en' : 'ar');
    document.documentElement.dir = lang === 'ar' ? 'ltr' : 'rtl';
    document.documentElement.lang = lang === 'ar' ? 'en' : 'ar';
  };

  return (
    <LangContext.Provider value={{ lang, setLang: toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
