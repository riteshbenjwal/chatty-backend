import { AuthPayload, IAuthDocument } from '@auth/interfaces/auth.interface';
import { Response } from 'express';

export const authMockRequest = (sessionData: IJWT, body: IAuthMock, currentUser?: AuthPayload | null, params?: any) => ({
  session: sessionData,
  body,
  params,
  currentUser
});

export const authMockResponse = (): Response => {
  const res: Response = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

export interface IJWT {
  jwt?: string;
}
export interface IAuthMock {
  _id?: string;
  username?: string;
  email?: string;
  uId?: string;
  password?: string;
  avatarColor?: string;
  avatarImage?: string;
  createdAt?: Date | string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  quote?: string;
  work?: string;
  school?: string;
  location?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  messages?: boolean;
  reactions?: boolean;
  comments?: boolean;
  follows?: boolean;
}

export const authUserPayload: AuthPayload = {
  userId: '60263f14648fed5246e322d9',
  uId: '1621613119252066',
  username: 'Manny',
  email: 'manny@me.com',
  avatarColor: '#9c27b0',
  iat: 12345
};

export const authMock = {
  _id: '60263f14648fed5246e322d3',
  uId: '1621613119252066',
  username: 'Manny',
  email: 'manny@me.com',
  avatarColor: '#9c27b0',
  createdAt: '2022-08-31T07:42:24.451Z',
  save: () => {},
  comparePassword: () => false
} as unknown as IAuthDocument;

export const signUpMockData = {
  _id: '640e8f8ace19e723908e5e94',
  uId: '1621613119252066',
  username: 'Manny',
  email: 'manny@test.com',
  avatarColor: '#9c27b0',
  password: 'manny1',
  birthDay: { month: '', day: '' },
  postCount: 0,
  gender: '',
  quotes: '',
  about: '',
  relationship: '',
  blocked: [],
  blockedBy: [],
  bgImageVersion: '',
  bgImageId: '',
  work: [],
  school: [],
  placesLived: [],
  createdAt: new Date(),
  followersCount: 0,
  followingCount: 0,
  notifications: { message: true, reactions: true, comments: true, follows: true },
  profilePicture: 'https://res.cloudinary.com/dyamr9ym3/image/upload/v1678675852/640e8f8ace19e723908e5e95'
};