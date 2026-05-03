import { useTranslation } from 'react-i18next';
import { GRANT_TYPES } from '@/constant/auth';
import { SsoSignin } from '../signin-sso';
import { SigninEmail } from '../signin-email';
import { useTheme } from '@/styles/theme/theme-provider';
import darklogo from '@/assets/images/construct_logo_dark.svg';
import lightlogo from '@/assets/images/construct_logo_light.svg';
import { Link, useLocation } from 'react-router-dom';
import { useGetLoginOptions, useGetSignupSettings } from '../../hooks/use-auth';

export const Signin = () => {
  const { data: loginOption } = useGetLoginOptions();
  const { data: signupSettings } = useGetSignupSettings();

  const { theme } = useTheme();
  const { t } = useTranslation();
  const location = useLocation();
  const ssoError = location.state?.ssoError;

  const passwordGrantAllowed = !!loginOption?.allowedGrantTypes?.includes(GRANT_TYPES.password);
  const socialGrantAllowed =
    !!loginOption?.allowedGrantTypes?.includes(GRANT_TYPES.social) &&
    !!loginOption?.ssoInfo?.length;
  const oidcGrantAllowed = !!loginOption?.allowedGrantTypes?.includes(GRANT_TYPES.oidc);

  const isDivider = passwordGrantAllowed && (socialGrantAllowed || oidcGrantAllowed);

  const isBannerAllowedToVisible = [
    'localhost',
    'construct.seliseblocks.com',
    'stg-construct.seliseblocks.com',
    'dev-construct.seliseblocks.com',
  ].some((domain) => window.location.hostname === domain);
  return (
    <div className="flex flex-col gap-10 w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      <div className="flex flex-col gap-8">
        <div className="w-40 h-16 transition-transform hover:scale-105 duration-300">
          <img src={theme === 'dark' ? lightlogo : darklogo} className="w-full h-full object-contain" alt="logo" />
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold text-high-emphasis tracking-tight">
            {t('LOG_IN')}
          </h1>
          {(signupSettings?.isEmailPasswordSignUpEnabled || signupSettings?.isSSoSignUpEnabled) && (
            <div className="flex items-center gap-2 text-[15px]">
              <span className="font-medium text-medium-emphasis">
                {t('DONT_HAVE_ACCOUNT')}
              </span>
              <Link
                to={'/signup'}
                className="font-bold text-primary hover:text-primary-600 transition-colors relative group"
              >
                {t('SIGN_UP')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {ssoError && (
        <div className="w-full animate-in zoom-in-95 duration-300">
          <div className="rounded-xl bg-error/10 border border-error/20 p-5 backdrop-blur-sm">
            <p className="text-[13px] font-medium text-error leading-relaxed">
              {ssoError}
            </p>
          </div>
        </div>
      )}

      <div className={'w-full ' + (isBannerAllowedToVisible ? 'visible' : 'invisible h-0')}>
        <div className="rounded-xl bg-success/10 border border-success/20 p-5 backdrop-blur-sm">
          <p className="text-[13px] font-medium text-success leading-relaxed">
            <span className="opacity-70">Log in to explore the complete Demo. Credentials:</span><br/>
            <span className="font-bold select-all">demo.construct@seliseblocks.com</span><br/>
            <span className="opacity-70">Password:</span> <span className="font-bold select-all">H%FE*FYi5oTQ!VyT6TkEy</span>
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-8">
        {passwordGrantAllowed && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
            <SigninEmail />
          </div>
        )}
        {isDivider && (
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] font-bold">
              <span className="bg-background px-4 text-muted-foreground/60">{t('AUTH_OR')}</span>
            </div>
          </div>
        )}
        {socialGrantAllowed && loginOption && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
            <SsoSignin loginOption={loginOption} />
          </div>
        )}
      </div>
    </div>
  );
};
