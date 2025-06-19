import jwt from "jsonwebtoken";

export const createJwt = (payload: any) => {
    return jwt.sign(payload, process.env.JWT_KEY as string)
}