export type SignupRequestType = {
  error: boolean;
  response: SignupResponseType;
};

export type SignupResponseType = {
  error?: boolean;
  user?: UserResponseType;
  message?: string;
};

export type UserResponseType = {
  id: number;
  email: string;
  name: string;
  lastName: string;
};
