import {NativeRouter, Routes} from 'react-router-native';

import LoginScreen from './login';
import RegisterScreen from './register';

const Screens = () => {
  return (
    <NativeRouter>
      <Routes>
        <Route path="/" element={<RegisterScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/login" element={<LoginScreen />} />
      </Routes>
    </NativeRouter>
  );
};
