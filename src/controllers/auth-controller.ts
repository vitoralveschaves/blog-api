import { RequestHandler, Response } from "express";
import { z } from "zod";
import { createUser } from "../services/user-service";
import { createToken, verifyUser } from "../services/auth-service";
import { ExtendedRequest } from "../types/extended-request";

export const signup: RequestHandler = async (req, res) => {
    const schema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
    });

    const data = schema.safeParse(req.body);

    if (!data.success) {
        res.status(422).json({error: data.error.flatten().fieldErrors});
        return;
    }

    const newUser = await createUser(data.data);

    if(!newUser) {
        res.status(400).json({error: "O email passado já está sendo utilizado."})
        return;
    }

    const token = createToken(newUser);

    res.status(201).json({
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        },
        token
    })
};

export const signin: RequestHandler = async (req, res) => {

    const schema = z.object({
        email: z.string().email(),
        password: z.string()
    });

    const data = schema.safeParse(req.body);

    if(!data.success) {
        res.status(422).json({error: data.error.flatten().fieldErrors});
        return;
    }

    const user = await verifyUser(data.data);

    if(!user) {
        res.status(401).json({error: "Email e/ou senha incorreto(s)"});
        return;
    }

    const token = createToken(user);

    res.status(200).json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        },
        token
    })
};

export const validate = async (req: ExtendedRequest, res: Response) => {
    res.status(200).json({user: req.user});
};
