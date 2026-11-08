import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: 'الاسم الكامل مطلوب (3 أحرف على الأقل)' })
    .max(50, { message: 'الاسم طويل جداً' }),
  email: z
    .string()
    .min(1, { message: 'البريد الإلكتروني مطلوب' })
    .email({ message: 'صيغة البريد الإلكتروني غير صحيحة' }),
  phone: z
    .string()
    .min(1, { message: 'رقم الجوال مطلوب' })
    .regex(/^(05|5)\d{8}$/, { message: 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام' }),
  city: z.string().min(2, { message: 'يرجى اختيار أو كتابة المدينة' }),
  streetAddress: z
    .string()
    .min(5, { message: 'العنوان الوطني أو اسم الشارع مطلوب (5 أحرف على الأقل)' }),
  paymentMethod: z.enum(['card', 'apple_pay', 'cod'], {
    errorMap: () => ({ message: 'يرجى اختيار وسيلة الدفع' }),
  }),
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
