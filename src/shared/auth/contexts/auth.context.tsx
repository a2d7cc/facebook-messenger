import {createContext, useState, ReactNode} from 'react';
import {Credentials, LoginUser, UserDetails} from '../models';
import {useMutation} from 'react-query';
import {login} from '../requests';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface IAuthContext {
  userDetails?: UserDetails;
  jwt?: string;
  isLoggedIn: boolean;
  isLogginIn: boolean;
  onLogin: (loginUser: LoginUser) => void;
  onLogout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  userDetails: undefined,
  jwt: undefined,
  isLoggedIn: false,
  isLogginIn: false,
  onLogin: () => {},
  onLogout: () => {},
});

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [userDetails, setUserDetails] = useState<UserDetails>();
  const [jwt, setJwt] = useState<string>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

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
        onLogin: loginHandler,
        onLogout: logoutHandler,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
