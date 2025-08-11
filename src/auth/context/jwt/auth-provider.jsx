import PropTypes from 'prop-types';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';
import { AuthContext } from './auth-context';
import { setSession, isValidToken, jwtDecode } from './utils'; // Ensure this path is correct

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);
      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        try {
          const response = await axios.get(endpoints.auth.me);
          const { user } = response.data;

          if (user && ['admin', 'housekeeper'].includes(user.role)) {
            dispatch({
              type: 'INITIAL',
              payload: {
                user: {
                  ...user,
                  accessToken,
                },
              },
            });
          } else {
            throw new Error('Invalid user role or data');
          }
        } catch (meError) {
          console.warn('Me endpoint failed, falling back to token:', meError.message);
          // Fallback: Decode token if me endpoint fails
          const decoded = jwtDecode(accessToken);
          if (decoded?.id && ['admin', 'housekeeper'].includes(decoded.role)) {
            dispatch({
              type: 'INITIAL',
              payload: {
                user: {
                  _id: decoded.id,
                  role: decoded.role,
                  accessToken,
                },
              },
            });
          } else {
            dispatch({
              type: 'INITIAL',
              payload: {
                user: null,
              },
            });
          }
        }
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error('Initialization Error:', error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post(endpoints.auth.login, { email, password });
      const { token, user } = response.data;

      if (!user || !['admin', 'housekeeper'].includes(user.role)) {
        throw new Error('You are not allowed to log in here.');
      }

      sessionStorage.setItem(STORAGE_KEY, token);
      sessionStorage.setItem('user', JSON.stringify(user));
      setSession(token);

      dispatch({
        type: 'LOGIN',
        payload: {
          user: {
            ...user,
            accessToken: token,
          },
        },
      });
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (values) => {
    const data = { ...values };
    const response = await axios.post(endpoints.auth.register, data);
    const { accessToken, user } = response.data;

    sessionStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user: {
          ...user,
          accessToken,
        },
      },
    });
  }, []);

  const logout = useCallback(async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  }, []);

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
