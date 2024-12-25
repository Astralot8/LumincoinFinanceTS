export type RefreshResponseType = {
    error?: boolean,
    tokens?: RefreshTokensType,
    message?: string,
}

export type RefreshTokensType = {
    accessToken: string,
    refreshToken: string,
}