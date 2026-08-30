import { useCallback, useEffect, useState } from 'react';
import { authService } from '../services';

export function useAuth() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('tnv_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('tnv_token');
    if (token && !localStorage.getItem('tnv_user')) {
      authService
        .me()
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem('tnv_user', JSON.stringify(res.data.user));
        })
        .catch(() => {
          localStorage.removeItem('tnv_token');
          localStorage.removeItem('tnv_user');
        });
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      localStorage.setItem('tnv_token', res.data.token);
      localStorage.setItem('tnv_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tnv_token');
    localStorage.removeItem('tnv_user');
    setUser(null);
  }, []);

  return { user, loading, login, logout };
}
