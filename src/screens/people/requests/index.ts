import {FriendRequest} from '../models/index';
import {baseUrl, get} from '../../../shared/requests';

export const getFriendRequests = async () => {
  const {data: friendRequests} = await get<FriendRequest[]>(
    `${baseUrl}/get-friends`,
  );

  return friendRequests;
};
