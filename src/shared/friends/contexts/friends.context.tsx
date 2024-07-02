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
import {
  ActiveFriend,
  CallActivity,
  CallDetails,
  CallResponse,
  ICallResponse,
} from '../models';
import {useQuery} from 'react-query';
import {getFriendRequests} from '../../../screens/people/requests';
import {UserDetails} from '../../auth/models';
import getFriends from '../helpers/friends';
import {IP_ADDRESS} from '@env';

export interface IFriendsContext {
  friends: ActiveFriend[];
  isLoading: boolean;
  setFriend: (friend: ActiveFriend) => void;
  setCallDetails: (callDetails: CallDetails | null) => void;
  setCallActivity: (callActivity: CallActivity) => void;
  startCall: (details: CallDetails) => void;
  respondToCall: (response: CallResponse) => void;
}

export const FriendsContext = createContext<IFriendsContext>({
  friends: [],
  isLoading: false,
  setFriend: () => null,
  setCallDetails: () => null,
  setCallActivity: () => null,
  startCall: () => null,
  respondToCall: () => null,
});

export const FriendsProvider = ({children}: {children: ReactNode}) => {
  const {isActive, jwt, isLoggedIn, userDetails} = useContext(AuthContext);
  const [friends, setFriends] = useState<ActiveFriчend[]>([]);
  const [friend, setFriend] = useState<ActiveFriend>({} as ActiveFriend);
  const [isLoading, setIsLoading] = useState(false);
  const [callDetails, setCallDetails] = useState<CallDetails | null>(null);
  const [callActivity, setCallActivity] = useState<CallActivity>(
    CallActivity.None,
  );

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

  const baseUrl = `http://${IP_ADDRESS ?? '10.0.2.2'}:7000`;

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
    socket.on('receiveCall', (friendsCallDetails: CallDetails) => {
      setCallDetails(friendsCallDetails);
      setCallActivity(CallActivity.Receiving);
    });

    socket.on('callResponse', (callResponse: ICallResponse) => {
      const hasFriendAccepted = callResponse.status === CallResponse.Accepted;

      setCallActivity(
        hasFriendAccepted ? CallActivity.Accepted : CallActivity.None,
      );
    });

    return () => {
      socket.off('newMessage');
      socket.off('receiveCall');
      socket.off('callResponse');
    };
  }, [socket, friends]);

  useEffect(() => {
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
      socket.emit('updateActiveStatus', false);
      socket.off('friendActive');
    };
  }, [socket]);

  const startCall = (details: CallDetails) => {
    socket.emit('startCall', details);
  };

  const respondToCall = (response: CallResponse) => {
    if (!callDetails) {
      return;
    }

    if (response === CallResponse.Accepted) {
      socket.emit('acceptCall', callDetails.friendId);
    } else {
      socket.emit('declineCall', callDetails.friendId);
    }
  };

  return (
    <FriendsContext.Provider
      value={{
        friends,
        isLoading,
        setFriend,
        setCallDetails,
        setCallActivity,
        startCall,
        respondToCall,
      }}>
      {children}
    </FriendsContext.Provider>
  );
};
