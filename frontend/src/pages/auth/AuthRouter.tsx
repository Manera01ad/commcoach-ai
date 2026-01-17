import React, { useState } from 'react';
import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';
import PasswordResetPage from './PasswordResetPage';

type AuthView = 'signin' | 'signup' | 'reset';

const AuthRouter: React.FC = () => {
  const [view, setView] = useState<AuthView>('signin');

  switch (view) {
    case 'signup':
      return <SignUpPage onSwitchToSignIn={() => setView('signin')} />;
    case 'reset':
      return <PasswordResetPage onBack={() => setView('signin')} />;
    case 'signin':
    default:
      return (
        <SignInPage
          onSwitchToSignUp={() => setView('signup')}
          onSwitchToReset={() => setView('reset')}
        />
      );
  }
};

export default AuthRouter;
