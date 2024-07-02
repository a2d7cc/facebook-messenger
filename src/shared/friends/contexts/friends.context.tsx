import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {AuthContext} from '../../auth/contexts/auth.context';
import {Platform} from 'react-native';
import SocketIOClient from 'socket.io-client';
import {ActiveFriend} from '../models';
import {useQuery} from 'react-query';
import {getFriendRequests} from '../../../screens/people/requests';
import {UserDetails} from '../../auth/models';
import getFriends from '../helpers/friends';

export interface IFriendsContext {
  friends: ActiveFriend[];
  isLoading: boolean;
  setFriend: (friend: ActiveFriend) => void;
}

export const FriendsContext = createContext<IFriendsContext>({
  friends: [],
  isLoading: false,
  setFriend: () => null,
});

export const FriendsProvider = ({children}: {children: ReactNode}) => {
  const {isActive, jwt, isLoggedIn, userDetails} = useContext(AuthContext);
  const [friends, setFriends] = useState<ActiveFriend[]>([]);
  const [friend, setFriend] = useState<ActiveFriend>({} as ActiveFriend);
  const [isLoading, setIsLoading] = useState(false);

  useQuery(
    'friendRequests',
    async () => {
      setIsLoading(true);
      const friendRequests = await getFriendRequests();
      const _friends = getFriends(
        friendRequests,
        (userDetails as UserDetails).id,
      );
      const activeFriends: ActiveFriend[] = _friends.map(f => ({
        ...f,
        isActive: false,
      }));

      setFriends(activeFriends);
      return _friends;
    },
    {
      enabled: isLoggedIn,
      onSettled: () => {
        setIsLoading(false);
      },
    },
  );

  const baseUrl =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:6000'
      : 'http://localhost:6000';

  const socket = useMemo(
    () =>
      SocketIOClient(baseUrl, {
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: jwt,
            },
          },
        },
      }),
    [jwt, baseUrl],
  );

  useEffect(() => {
    console.log('updateActiveStatus ####', isActive);
    socket.emit('updateActiveStatus', isActive);
    socket.on(
      'friendActive',
      ({id, isActive: isFriendActive}: {id: number; isActive: boolean}) => {
        setFriends(prevFriends => {
          if (userDetails?.id === id) {
            return prevFriends;
          }

          const updatedFriends = [...prevFriends];
          (updatedFriends.find(f => f.id === id) as ActiveFriend).isActive =
            isFriendActive;
          console.log('updatedFriends', updatedFriends);
          return updatedFriends;
        });
      },
    );

    return () => {
      console.log('updateActiveStatus CB', false);
      socket.emit('updateActiveStatus', false);
      socket.off('friendActive');
    };
  }, []);

  return (
    <FriendsContext.Provider value={{friends, isLoading, setFriend}}>
      {children}
    </FriendsContext.Provider>
  );
};
