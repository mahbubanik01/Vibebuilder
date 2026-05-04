import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signinFormDefaultValue, signinFormType, getSigninFormValidationSchema } from './utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui-kit/form';
import { Input } from '@/components/ui-kit/input';
import { Button } from '@/components/ui-kit/button';
import { useAuthStore } from '@/state/store/auth';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { useSigninEmail } from '../../hooks/use-auth';
import { Captcha, ErrorAlert, PasswordInput, useCaptcha } from '@/components/core';
import { useEffect, useRef, useState } from 'react';

const FAILED_ATTEMPTS_KEY = 'signin-failed-attempts';
const MAX_ATTEMPTS_BEFORE_CAPTCHA = 3;

export const SigninEmail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, setTokens } = useAuthStore();
  const { handleError } = useErrorHandler();

  const failedAttemptsRef = useRef<number>(
    parseInt(sessionStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10)
  );
  const [showCaptcha, setShowCaptcha] = useState(
    failedAttemptsRef.current >= MAX_ATTEMPTS_BEFORE_CAPTCHA
  );

  const form = useForm({
    defaultValues: signinFormDefaultValue,
    resolver: zodResolver(getSigninFormValidationSchema(t)),
  });

  const { isPending, mutateAsync, isError } = useSigninEmail();

  const googleSiteKey = import.meta.env.VITE_CAPTCHA_SITE_KEY || '';
  const captchaEnabled = googleSiteKey !== '';
  const captchaType =
    import.meta.env.VITE_CAPTCHA_TYPE === 'reCaptcha' ? 'reCaptcha-v2-checkbox' : 'hCaptcha';

  const {
    code: captchaCode,
    captcha,
    reset: resetCaptcha,
  } = useCaptcha({
    siteKey: googleSiteKey,
    type: captchaType,
  });

  const { isValid } = form.formState;

  useEffect(() => {
    if (!isValid && captchaCode) resetCaptcha();
  }, [captchaCode, isValid, resetCaptcha]);

  const onSubmitHandler = async (values: signinFormType) => {
    try {
      const res = await mutateAsync({
        username: values.username,
        password: values.password,
        ...(showCaptcha && captchaCode ? { captchaCode } : {}),
      });

      // Reset failed attempts on success
      failedAttemptsRef.current = 0;
      sessionStorage.removeItem(FAILED_ATTEMPTS_KEY);
      setShowCaptcha(false);

      if (res.enable_mfa)
        return navigate(
          `/verify-mfa?mfa_id=${res?.mfaId}&mfa_type=${res?.mfaType}&user_name=${values.username}`
        );

      login(res.access_token ?? '', res.refresh_token ?? '');
      setTokens({ accessToken: res.access_token ?? '', refreshToken: res.refresh_token ?? '' });
      navigate('/dashboard');
    } catch (error) {
      // Increment failed attempts
      failedAttemptsRef.current += 1;
      sessionStorage.setItem(FAILED_ATTEMPTS_KEY, failedAttemptsRef.current.toString());

      if (failedAttemptsRef.current >= MAX_ATTEMPTS_BEFORE_CAPTCHA) {
        setShowCaptcha(true);
      }

      resetCaptcha();
      handleError(error);
    }
  };

  const isCaptchaRequired = showCaptcha && captchaEnabled;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t('WELCOME_BACK', 'Welcome Back')}</h1>
        <p className="text-[#9DA7B3]">{t('SIGNIN_SUBTITLE', 'Sign in to your VibeBuilder account.')}</p>
      </div>

      <ErrorAlert
        isError={isError}
        title={t('INVALID_CREDENTIALS')}
        message={t('EMAIL_PASSWORD_NOT_VALID')}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-6">
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#9DA7B3]">{t('EMAIL')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('ENTER_YOUR_EMAIL')} 
                      {...field} 
                      className="h-12 bg-[#161B22] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] focus:ring-[#2F81F7]/20 transition-all rounded-xl"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px] font-medium text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-[#9DA7B3]">{t('PASSWORD')}</FormLabel>
                    <Link
                      to="/auth/forgot-password"
                      className="text-xs font-bold text-[#2F81F7] hover:underline transition-colors"
                    >
                      {t('FORGOT_PASSWORD')}
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput 
                      placeholder={t('ENTER_YOUR_PASSWORD')} 
                      {...field} 
                      className="h-12 bg-[#161B22] border-[#30363D] text-[#E6EDF3] focus:border-[#2F81F7] focus:ring-[#2F81F7]/20 transition-all rounded-xl"
                    />
                  </FormControl>
                  <FormMessage className="text-[11px] font-medium text-red-400" />
                </FormItem>
              )}
            />
          </div>

          {isCaptchaRequired && (
            <div className="p-4 rounded-xl bg-[#161B22] border border-[#30363D]">
              <Captcha {...captcha} theme="dark" size="normal" />
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 bg-[#2F81F7] hover:bg-[#1F6FEB] text-white font-bold rounded-xl shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all disabled:opacity-50"
            disabled={isPending || (isCaptchaRequired && !captchaCode)}
          >
            {isPending ? (
               <div className="flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 <span>{t('LOGGING_IN', 'Logging in...')}</span>
               </div>
            ) : t('LOG_IN')}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <p className="text-sm text-[#9DA7B3]">
          {t('DONT_HAVE_ACCOUNT', "Don't have an account?")}{' '}
          <Link to="/auth/signup" className="text-[#2F81F7] font-bold hover:underline">
            {t('GET_STARTED', 'Get Started')}
          </Link>
        </p>
      </div>
    </div>
  );
};
