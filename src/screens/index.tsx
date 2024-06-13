import {NativeRouter, Routes, Route} from 'react-router-native';

import LoginScreen from './login';
import RegisterScreen from './register';

import {BottomNavigation as NavScreens, Text} from 'react-native-paper';

import ChatScreen from './chat/chat';
import {useContext, useState} from 'react';
import {AuthContext} from '../shared/auth/contexts/auth.context';
import {navRoutes} from '../shared/constants/navRoutes';
import {ChatsScreen} from './chats';

const Screens = () => {
  const {isLoggedIn} = useContext(AuthContext);

  const [index, setIndex] = useState(0);
  const [routes] = useState(navRoutes);

  const renderScene = NavScreens.SceneMap({
    chats: ChatsScreen,
    calls: () => <Text>Calls</Text>,
    people: () => <Text>Peoples</Text>,
    stories: () => <Text>Stories</Text>,
  });

  return (
    <NativeRouter>
      {isLoggedIn ? (
        <Routes>
          <Route
            path="/"
            element={
              <NavScreens
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
              />
            }
          />
          <Route
            path="/login"
            element={
              <NavScreens
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
              />
            }
          />
          <Route path="/chat/:chatId" element={<ChatScreen />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<RegisterScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      )}
    </NativeRouter>
  );
};

export default Screens;
