export interface Payload<T> {
  type: string;
  channel: VoiceNote['channel'];
  payload: T;
}

export interface VoiceNote {
  id: string;
  author: string;
  author_color: string;
  path: string;
  duration: number;
  channel: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TwitchOAuthValidResponse {
  client_id: string;
  login: string;
  scopes: string[];
  user_id: string;
  expires_in: number;
  color?: string;
}
