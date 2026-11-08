import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { Modal } from '../../../shared/components/Modal/Modal';
import { IconClose } from '../../../shared/components/Icons/Icons';
import { validateInput } from '../../../shared/validation/validation';

export const AuthModal: React.FC = () => {
  const { user, isAuthenticated, isModalOpen, closeModal, login, register, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRemember, setLoginRemember] = useState(true);
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    const emailErr = validateInput('email', loginEmail);
    if (emailErr) errors.email = emailErr;
    const passErr = validateInput('password', loginPassword);
    if (passErr) errors.password = passErr;

    setLoginErrors(errors);
    if (Object.keys(errors).length > 0) return;

    login(loginEmail, loginPassword, loginRemember);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    const nameErr = validateInput('name', registerName);
    if (nameErr) errors.name = nameErr;
    const emailErr = validateInput('email', registerEmail);
    if (emailErr) errors.email = emailErr;
    const phoneErr = validateInput('phone', registerPhone);
    if (phoneErr) errors.phone = phoneErr;
    const passErr = validateInput('password', registerPassword);
    if (passErr) errors.password = passErr;

    setRegisterErrors(errors);
    if (Object.keys(errors).length > 0) return;

    register({
      name: registerName,
      email: registerEmail,
      phone: registerPhone,
      password: registerPassword,
    });
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      id="auth-dialog"
      className="modal-dialog auth-dialog"
      aria-labelledby="auth-modal-title"
    >
      <div className="modal-card auth-dialog-content">
        <header className="dialog-header">
          <h2 id="auth-modal-title">
            {isAuthenticated ? 'حسابي في ShopBoard' : 'تسجيل الدخول إلى ShopBoard'}
          </h2>
          <button
            type="button"
            id="auth-close-btn"
            className="icon-close-btn"
            aria-label="إغلاق نافذة الحساب"
            onClick={closeModal}
          >
            <IconClose size={20} />
          </button>
        </header>

        {!isAuthenticated ? (
          <div id="auth-anonymous-section">
            <div className="auth-tabs" role="tablist" aria-label="خيارات الحساب">
              <button
                type="button"
                id="tab-login"
                className={`auth-tab ${activeTab === 'login' ? 'is-active' : ''}`}
                role="tab"
                aria-selected={activeTab === 'login'}
                aria-controls="login-form"
                onClick={() => setActiveTab('login')}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                id="tab-register"
                className={`auth-tab ${activeTab === 'register' ? 'is-active' : ''}`}
                role="tab"
                aria-selected={activeTab === 'register'}
                aria-controls="register-form"
                onClick={() => setActiveTab('register')}
              >
                إنشاء حساب جديد
              </button>
            </div>

            {/* Login Form */}
            {activeTab === 'login' ? (
              <form
                id="login-form"
                className="auth-form"
                role="tabpanel"
                aria-labelledby="tab-login"
                onSubmit={handleLoginSubmit}
                noValidate
              >
                <div className="form-field">
                  <label htmlFor="login-email" className="field-label">
                    البريد الإلكتروني:
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    aria-label="البريد الإلكتروني"
                    required
                    placeholder="name@example.com"
                    autoComplete="email"
                    dir="ltr"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (loginErrors.email) setLoginErrors((p) => ({ ...p, email: '' }));
                    }}
                    className={loginErrors.email ? 'has-error' : ''}
                    aria-invalid={Boolean(loginErrors.email)}
                    aria-describedby={loginErrors.email ? 'login-email-error' : undefined}
                  />
                  {loginErrors.email && (
                    <span className="field-error" id="login-email-error" role="alert">
                      {loginErrors.email}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="login-password" className="field-label">
                    كلمة المرور:
                  </label>
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    aria-label="كلمة المرور"
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                    dir="ltr"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginErrors.password) setLoginErrors((p) => ({ ...p, password: '' }));
                    }}
                    className={loginErrors.password ? 'has-error' : ''}
                    aria-invalid={Boolean(loginErrors.password)}
                    aria-describedby={loginErrors.password ? 'login-password-error' : undefined}
                  />
                  {loginErrors.password && (
                    <span className="field-error" id="login-password-error" role="alert">
                      {loginErrors.password}
                    </span>
                  )}
                </div>

                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="login-remember"
                    name="remember"
                    aria-label="تذكر تسجيل دخولي على هذا الجهاز"
                    checked={loginRemember}
                    onChange={(e) => setLoginRemember(e.target.checked)}
                  />
                  <label htmlFor="login-remember" className="checkbox-label">
                    تذكر تسجيل دخولي على هذا الجهاز
                  </label>
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-lg auth-submit-btn">
                  دخول إلى الحساب
                </button>
              </form>
            ) : (
              /* Register Form */
              <form
                id="register-form"
                className="auth-form"
                role="tabpanel"
                aria-labelledby="tab-register"
                onSubmit={handleRegisterSubmit}
                noValidate
              >
                <div className="form-field">
                  <label htmlFor="register-name" className="field-label">
                    الاسم الكامل:
                  </label>
                  <input
                    type="text"
                    id="register-name"
                    name="name"
                    aria-label="الاسم الكامل"
                    required
                    placeholder="مثال: عبدالله محمد"
                    autoComplete="name"
                    value={registerName}
                    onChange={(e) => {
                      setRegisterName(e.target.value);
                      if (registerErrors.name) setRegisterErrors((p) => ({ ...p, name: '' }));
                    }}
                    className={registerErrors.name ? 'has-error' : ''}
                    aria-invalid={Boolean(registerErrors.name)}
                    aria-describedby={registerErrors.name ? 'register-name-error' : undefined}
                  />
                  {registerErrors.name && (
                    <span className="field-error" id="register-name-error" role="alert">
                      {registerErrors.name}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="register-email" className="field-label">
                    البريد الإلكتروني:
                  </label>
                  <input
                    type="email"
                    id="register-email"
                    name="email"
                    aria-label="البريد الإلكتروني"
                    required
                    placeholder="name@example.com"
                    autoComplete="email"
                    dir="ltr"
                    value={registerEmail}
                    onChange={(e) => {
                      setRegisterEmail(e.target.value);
                      if (registerErrors.email) setRegisterErrors((p) => ({ ...p, email: '' }));
                    }}
                    className={registerErrors.email ? 'has-error' : ''}
                    aria-invalid={Boolean(registerErrors.email)}
                    aria-describedby={registerErrors.email ? 'register-email-error' : undefined}
                  />
                  {registerErrors.email && (
                    <span className="field-error" id="register-email-error" role="alert">
                      {registerErrors.email}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="register-phone" className="field-label">
                    رقم الجوال:
                  </label>
                  <input
                    type="tel"
                    id="register-phone"
                    name="phone"
                    aria-label="رقم الجوال"
                    required
                    placeholder="05XXXXXXXX"
                    autoComplete="tel"
                    dir="ltr"
                    value={registerPhone}
                    onChange={(e) => {
                      setRegisterPhone(e.target.value);
                      if (registerErrors.phone) setRegisterErrors((p) => ({ ...p, phone: '' }));
                    }}
                    className={registerErrors.phone ? 'has-error' : ''}
                    aria-invalid={Boolean(registerErrors.phone)}
                    aria-describedby={registerErrors.phone ? 'register-phone-error' : undefined}
                  />
                  {registerErrors.phone && (
                    <span className="field-error" id="register-phone-error" role="alert">
                      {registerErrors.phone}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="register-password" className="field-label">
                    كلمة المرور الجديدة:
                  </label>
                  <input
                    type="password"
                    id="register-password"
                    name="password"
                    aria-label="كلمة المرور الجديدة"
                    required
                    minLength={6}
                    placeholder="6 خانات على الأقل"
                    autoComplete="new-password"
                    dir="ltr"
                    value={registerPassword}
                    onChange={(e) => {
                      setRegisterPassword(e.target.value);
                      if (registerErrors.password)
                        setRegisterErrors((p) => ({ ...p, password: '' }));
                    }}
                    className={registerErrors.password ? 'has-error' : ''}
                    aria-invalid={Boolean(registerErrors.password)}
                    aria-describedby={
                      registerErrors.password ? 'register-password-error' : undefined
                    }
                  />
                  {registerErrors.password && (
                    <span className="field-error" id="register-password-error" role="alert">
                      {registerErrors.password}
                    </span>
                  )}
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-lg auth-submit-btn">
                  إنشاء الحساب الآن
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Authenticated User Profile */
          <div id="auth-authenticated-section" className="auth-authenticated-section">
            <h3 id="auth-user-name" className="auth-profile-name">
              {user?.name}
            </h3>
            <p id="auth-user-email" className="auth-profile-email">
              {user?.email}
            </p>
            {user?.phone && (
              <p
                className="auth-profile-phone"
                style={{
                  color: 'var(--color-stone-500)',
                  fontSize: '0.9rem',
                  marginBottom: '1.25rem',
                }}
              >
                رقم الجوال: {user.phone}
              </p>
            )}
            <div className="auth-profile-actions">
              <button
                type="button"
                id="auth-logout-btn"
                className="btn btn-outline btn-block"
                onClick={logout}
              >
                تسجيل الخروج من الحساب
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
