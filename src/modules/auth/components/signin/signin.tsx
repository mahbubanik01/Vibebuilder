import { useTranslation } from 'react-i18next';
import { GRANT_TYPES } from '@/constant/auth';
import { SsoSignin } from '../signin-sso';
import { SigninEmail } from '../signin-email';
import { SigninOidc } from '../signin-oidc/signin-oidc';
import { useLocation } from 'react-router-dom';
import { useGetLoginOptions } from '../../hooks/use-auth';

export const Signin = () => {
  const { data: loginOption } = useGetLoginOptions();
  const { t } = useTranslation();
  const location = useLocation();
  const ssoError = location.state?.ssoError;

  const passwordGrantAllowed = !!loginOption?.allowedGrantTypes?.includes(GRANT_TYPES.password);
  const socialGrantAllowed =
    !!loginOption?.allowedGrantTypes?.includes(GRANT_TYPES.social) &&
    !!loginOption?.ssoInfo?.length;
  const oidcGrantAllowed = !!loginOption?.allowedGrantTypes?.includes(GRANT_TYPES.oidc);

  const isDivider = passwordGrantAllowed && (socialGrantAllowed || oidcGrantAllowed);

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      {ssoError && (
        <div className="w-full mb-8 animate-in zoom-in-95 duration-300">
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-5 backdrop-blur-sm">
            <p className="text-[13px] font-medium text-red-400 leading-relaxed text-center">
              {ssoError}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex flex-col gap-8">
        {passwordGrantAllowed && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
            <SigninEmail />
          </div>
        )}

        {oidcGrantAllowed && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
            <SigninOidc />
          </div>
        )}
        
        {isDivider && (
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#30363D]"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] font-bold">
            <span className="bg-[#0D1117] px-4 text-[#9DA7B3]">{t('AUTH_OR')}</span>
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
