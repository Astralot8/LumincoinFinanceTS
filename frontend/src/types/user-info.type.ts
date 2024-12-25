export type UserFullInfoType = {
    accessToken?: string,
    refreshToken?: string,
    userInfoToken?: UserInfoType,
}

export type UserInfoType = {
  name: string,
  lastName: string,
  id: number,
};
