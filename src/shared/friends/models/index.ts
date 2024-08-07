import {UserDetails} from '../../auth/models';

export interface ActiveFriend extends UserDetails {
  isActive: boolean;
}

export interface CallDetails {
  meetingId: string;
  friendId: string;
}

export enum CallResponse {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
}

export interface ICallResponse {
  status: CallResponse;
}

export enum CallActivity {
  None = 'NONE',
  Receiving = 'RECEIVING',
  Requesting = 'REQUESTING',
  Accepted = 'ACCEPTED',
}
