import bcrypt from "bcryptjs";
import {User} from "../generated/prisma"
import { createJwt, readJwt } from "../libs/jwt"
import { prisma } from "../libs/prisma";
import { Request } from "express";
import { getById } from "./user-service";

export const createToken = (user: User) => {
    return createJwt({id: user.id});
}

type VerifyUserProps = {
    email: string;
    password: string;
}

export const verifyUser = async ({ email, password }: VerifyUserProps) => {
    const user = await prisma.user.findFirst({
        where: {email}
    })
    if(!user) return;
    if(!bcrypt.compareSync(password, user.password)) return;
    return user;
}

type TokenPayloadProp = {
    id: number;
}

export const verifyRequest = async (req: Request) => {
    const {authorization} = req.headers;
    if(authorization) {
        const bearerToken = authorization.split("Bearer ");
        if(bearerToken[1]) {
            const tokenPayload = readJwt(bearerToken[1]);
            if(tokenPayload) {
                const userId = (tokenPayload as TokenPayloadProp).id;
                const user = await getById(userId);
                if(user) {
                    return user;
                }
            }
        }
    }
    return;
}