// Form Validation Rules & Utilities
import { VALID_COUPONS } from '../modules/cart/cart.logic';

export interface ValidationRule {
  test: (val: string) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

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
      return code.length >= 3 && Boolean((VALID_COUPONS as Record<string, unknown>)[code]);
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

export function validateField(
  input: HTMLInputElement | HTMLSelectElement | null,
  ruleKey: string,
): boolean {
  const rule = VALIDATION_RULES[ruleKey];
  if (!rule || !input) return true;

  const value = input.value || '';
  const isValid = rule.test(value);

  const container = input.closest('.form-field') || input.parentElement;
  if (!container) return isValid;

  let errorEl = container.querySelector<HTMLElement>('.field-error');

  if (!isValid) {
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'field-error';
      errorEl.id = `${input.id}-error`;
      errorEl.setAttribute('role', 'alert');
      container.appendChild(errorEl);
    }
    errorEl.textContent = rule.message;
    input.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorEl.id);
  } else {
    if (errorEl) {
      errorEl.remove();
    }
    input.classList.remove('has-error');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  }

  return isValid;
}

export function clearValidationErrors(root: HTMLElement | null): void {
  if (!root) return;
  root.querySelectorAll('.field-error').forEach((el) => el.remove());
  root.querySelectorAll<HTMLInputElement | HTMLSelectElement>('.has-error').forEach((input) => {
    input.classList.remove('has-error');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  });
}

export interface FieldConfig {
  inputId: string;
  ruleKey: string;
}

export function validateForm(form: HTMLFormElement, fieldConfigs: FieldConfig[]): boolean {
  let isAllValid = true;
  let firstInvalidInput: HTMLInputElement | HTMLSelectElement | null = null;

  fieldConfigs.forEach(({ inputId, ruleKey }) => {
    const input = form.querySelector<HTMLInputElement | HTMLSelectElement>(`#${inputId}`);
    if (input) {
      const valid = validateField(input, ruleKey);
      if (!valid) {
        isAllValid = false;
        if (!firstInvalidInput) {
          firstInvalidInput = input;
        }
      }
    }
  });

  if (firstInvalidInput) {
    (firstInvalidInput as HTMLElement).focus();
  }

  return isAllValid;
}

export function attachLiveValidation(
  inputId: string,
  ruleKey: string,
  options: { validateOnBlur?: boolean } = { validateOnBlur: true },
): void {
  const input = document.querySelector<HTMLInputElement | HTMLSelectElement>(`#${inputId}`);
  if (!input) return;

  if (options.validateOnBlur) {
    input.addEventListener('blur', () => {
      if (input.value.trim().length > 0) {
        validateField(input, ruleKey);
      }
    });
  }

  input.addEventListener('input', () => {
    if (input.classList.contains('has-error')) {
      validateField(input, ruleKey);
    }
  });
}
