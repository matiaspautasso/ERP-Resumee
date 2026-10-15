import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth-context';
import { LoginForm } from './login-form';

/** Container: wires the login form to the auth context and navigation. */
export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    setPending(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setPending(false);
    }
  };

  return <LoginForm onSubmit={handleSubmit} pending={pending} error={error} />;
}
