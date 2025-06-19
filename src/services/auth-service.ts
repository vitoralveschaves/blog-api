import bcrypt from "bcryptjs";
import {User} from "../generated/prisma"
import { createJwt } from "../libs/jwt"
import { prisma } from "../libs/prisma";

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