import { RequestHandler, Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { z } from "zod";
import { createPost, createPostSlug } from "../services/post-service";
import { getById } from "../services/user-service";

export const addPost = async (req: ExtendedRequest, res: Response) => {

    if(!req.user) return;

    const schema = z.object({
        title: z.string(),
        body: z.string(),
        tags: z.string()
    })

    const data = schema.safeParse(req.body);

    if(!data.success) {
        res.status(422).json({error: data.error.flatten().fieldErrors});
        return;
    }

    const slug = await createPostSlug(data.data.title);

    const newPost = await createPost({
        authorId: req.user.id,
        slug,
        title: data.data.title,
        body: data.data.body,
        tags: data.data.tags
    })

    const author = await getById(newPost.authorId);

    res.status(201).json({
        post: {
            id: newPost.id,
            slug: newPost.slug,
            title: newPost.title,
            body: newPost.body,
            tags: newPost.tags,
            authorName: author?.name
        }
    })
};

export const getPosts: RequestHandler = async (req, res) => {};
export const getPost: RequestHandler = async (req, res) => {};
export const editPost: RequestHandler = async (req, res) => {};
export const removePost: RequestHandler = async (req, res) => {};
