import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
import { Captcha, useCaptcha } from '@/components/core';
import { signupFormDefaultValue, signupFormType, getSignupFormValidationSchema } from './utils';
import { useSignupByEmail } from '../../hooks/use-auth';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui-kit/checkbox';

export const SignupForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [alreadyRegisteredMessage, setAlreadyRegisteredMessage] = useState('');

  const form = useForm<signupFormType>({
    defaultValues: signupFormDefaultValue,
    resolver: zodResolver(getSignupFormValidationSchema(t)),
  });

  const { mutateAsync, isPending } = useSignupByEmail();
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

  const onSubmitHandler = async (values: signupFormType) => {
    try {
      await mutateAsync({
        ...values,
        captchaCode,
      });
      return navigate(`/auth/sent-email`);
    } catch (error) {
      const res = JSON.stringify(error);
      if (res.includes('already_signup')) {
        setAlreadyRegisteredMessage(t('EMAIL_ALREADY_REGISTERED'));
      }
      resetCaptcha();
      toast({ variant: 'destructive', title: t('ERROR'), description: t('SOMETHING_WENT_WRONG') });
    }
  };

  useEffect(() => {
    if (!isValid && captchaCode) resetCaptcha();
  }, [captchaCode, isValid, resetCaptcha]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">{t('CREATE_ACCOUNT', 'Join VibeBuilder')}</h1>
        <p className="text-[#9DA7B3]">{t('SIGNUP_SUBTITLE', 'Start designing high-fidelity sites today.')}</p>
      </div>

      {alreadyRegisteredMessage !== '' && (
        <div className="w-full">
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
            <p className="text-sm font-medium text-red-400 text-center">
              {alreadyRegisteredMessage}
            </p>
          </div>
        </div>
      )}

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmitHandler)}>
          <FormField
            control={form.control}
            name="email"
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

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#161B22] border border-[#30363D]">
              <Checkbox
                id="terms-checkbox"
                checked={isTermsAccepted}
                onCheckedChange={(checked: boolean) => setIsTermsAccepted(checked)}
                className="mt-1 border-[#30363D] data-[state=checked]:bg-[#2F81F7]"
              />
              <label
                htmlFor="terms-checkbox"
                className="text-xs font-medium leading-relaxed text-[#9DA7B3] cursor-pointer"
              >
                {t('I_AGREE_TO', 'I agree to the')}{' '}
                <a href="https://selisegroup.com/software-development-terms/" className="text-[#2F81F7] hover:underline" target="_blank" rel="noreferrer">
                  {t('TERM_OF_SERVICE', 'Terms of Service')}
                </a>{' '}
                {t('ACKNOWLEDGE_I_HAVE_READ', 'and acknowledge the')}{' '}
                <a href="https://selisegroup.com/privacy-policy/" className="text-[#2F81F7] hover:underline" target="_blank" rel="noreferrer">
                  {t('PRIVACY_POLICY', 'Privacy Policy')}
                </a>
              </label>
            </div>
          </div>

          {captchaEnabled && (
            <div className="p-4 rounded-xl bg-[#161B22] border border-[#30363D]">
              <Captcha {...captcha} theme="dark" size="normal" />
            </div>
          )}

          <Button
            className="w-full h-12 bg-[#2F81F7] hover:bg-[#1F6FEB] text-white font-bold rounded-xl shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all disabled:opacity-50"
            size="lg"
            type="submit"
            disabled={!isTermsAccepted || (captchaEnabled && !captchaCode) || isPending}
          >
            {isPending ? (
               <div className="flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 <span>{t('CREATING_ACCOUNT', 'Creating Account...')}</span>
               </div>
            ) : t('SIGN_UP')}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <p className="text-sm text-[#9DA7B3]">
          {t('ALREADY_HAVE_ACCOUNT', 'Already have an account?')}{' '}
          <Link to="/auth/signin" className="text-[#2F81F7] font-bold hover:underline">
            {t('LOG_IN')}
          </Link>
        </p>
      </div>
    </div>
  );
};
