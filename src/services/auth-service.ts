import {User} from "../generated/prisma"
import { createJwt } from "../libs/jwt"

export const createToken = (user: User) => {
    return createJwt({id: user.id});
}