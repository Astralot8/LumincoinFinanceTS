import { RefreshTokensType } from "./refresh-response.type"
import { UserInfoType } from "./user-info.type"

export type LoginRequestType = {
    error: boolean,
    response: LoginResponseType,
}

export type LoginResponseType = {
    error?: boolean,
    user?: UserInfoType,
    tokens?: RefreshTokensType,
    message?: string,
}
