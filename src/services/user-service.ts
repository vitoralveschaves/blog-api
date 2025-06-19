import bcrypt from "bcryptjs";
import { prisma } from "../libs/prisma";

type CreateUserProps = {
    name: string;
    email: string;
    password: string;
};

export const createUser = async ({ name, email, password }: CreateUserProps) => {

    const user = await prisma.user.findFirst({
        where: { email }
    })

    if(user) {
        return;
    }

    const encodePassword = bcrypt.hashSync(password);

    return prisma.user.create({
        data: { name, email, password: encodePassword }
    })
};
