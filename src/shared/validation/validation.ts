export interface ValidationRule {
  test: (val: string) => boolean;
  message: string;
}

export const VALID_COUPONS = ['SHOP20', 'WELCOME10'];

export const VALIDATION_RULES: Record<string, ValidationRule> = {
  name: {
    test: (val: string) => val.trim().length >= 3 && !/^\d+$/.test(val.trim()),
    message: 'يرجى إدخال اسم صحيح لا يقل عن 3 أحرف',
  },
  email: {
    test: (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim()),
    message: 'يرجى إدخال عنوان بريد إلكتروني صالح (مثال: name@domain.com)',
  },
  phone: {
    test: (val: string) => /^(05|5|\+9665|\+?)[0-9]{8,12}$/.test(val.trim().replace(/[\s-]/g, '')),
    message: 'يرجى إدخال رقم جوال صحيح (مثال: 0512345678)',
  },
  password: {
    test: (val: string) => val.length >= 6,
    message: 'كلمة المرور يجب أن تتكون من 6 خانات على الأقل',
  },
  city: {
    test: (val: string) => val.trim().length >= 4,
    message: 'يرجى إدخال اسم المدينة والعنوان بالتفصيل (4 أحرف على الأقل)',
  },
  coupon: {
    test: (val: string) => {
      const code = val.trim().toUpperCase();
      return code.length >= 3 && VALID_COUPONS.includes(code);
    },
    message: 'كود الخصم غير صالح — جرب SHOP20 أو WELCOME10',
  },
  search: {
    test: (val: string) => val.trim().length <= 80 && !/[<>]/.test(val),
    message: 'نص البحث يجب ألا يتجاوز 80 حرفاً أو يحتوي على رموز غير مسموحة',
  },
  priceRange: {
    test: (val: string) => {
      const num = Number(val);
      return !Number.isNaN(num) && num >= 50 && num <= 6000;
    },
    message: 'نطاق السعر يجب أن يكون بين 50 و 6000 ر.س',
  },
};

export function validateInput(ruleKey: string, value: string): string | null {
  const rule = VALIDATION_RULES[ruleKey];
  if (!rule) return null;
  return rule.test(value) ? null : rule.message;
}
