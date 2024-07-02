import {createContext, useState, ReactNode, useRef, useEffect} from 'react';
import {Credentials, LoginUser, UserDetails} from '../models';
import {useMutation} from 'react-query';
import {login} from '../requests';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppState} from 'react-native';

export interface IAuthContext {
  userDetails?: UserDetails;
  jwt?: string;
  isLoggedIn: boolean;
  isLogginIn: boolean;
  isActive: boolean;
  onLogin: (loginUser: LoginUser) => void;
  onLogout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  userDetails: undefined,
  jwt: undefined,
  isLoggedIn: false,
  isLogginIn: false,
  isActive: false,
  onLogin: () => {},
  onLogout: () => {},
});

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [userDetails, setUserDetails] = useState<UserDetails>();
  const [jwt, setJwt] = useState<string>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  console.log('isLoggedIn', isLoggedIn);
  console.log('appStateVisible', appStateVisible);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const loginMutation = useMutation(
    (loginUser: LoginUser) => login(loginUser),
    {
      onSuccess: credentials => {
        setIsLoggingIn(false);
        setUserDetails(credentials.user);
        setJwt(credentials.token);
        setIsLoggedIn(true);
        _storeCredentials(credentials);
      },
      onError: error => {
        console.log('error', error);
      },
      onSettled: () => {
        setIsLoggingIn(false);
      },
    },
  );

  const loginHandler = (loginUser: LoginUser) => {
    setIsLoggingIn(true);
    loginMutation.mutate(loginUser);
  };

  const logoutHandler = () => {
    setUserDetails(undefined);
    setJwt(undefined);
    setIsLoggedIn(false);
  };

  const _storeCredentials = async (credentials: Credentials) => {
    try {
      await AsyncStorage.setItem('credentials', JSON.stringify(credentials));
    } catch (error) {
      console.log('_storeCredentials', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userDetails,
        jwt,
        isLoggedIn,
        isLogginIn: isLoggingIn,
        isActive: isLoggedIn && appStateVisible === 'active',
        onLogin: loginHandler,
        onLogout: logoutHandler,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
