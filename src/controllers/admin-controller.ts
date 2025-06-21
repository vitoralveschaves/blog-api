import { RequestHandler, Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { z } from "zod";
import { createPost, createPostSlug, deletePost, getAllPosts, getPostBySlug, updatePost } from "../services/post-service";
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

export const editPost = async (req: ExtendedRequest, res: Response) => {
    const { slug } = req.params;

    const schema = z.object({
        status: z.enum(["PUBLISHED", "DRAFT"]).optional(),
        title: z.string().optional(),
        body: z.string().optional(),
        tags: z.string().optional()
    })

    const data = schema.safeParse(req.body);

    if(!data.success) {
        res.status(422).json({error: data.error.flatten().fieldErrors});
        return;
    }

    const post = await getPostBySlug(slug);

    if(!post) {
        res.status(404).json({error: "Post não encontrado"});
        return;
    }

    const updatedPost = await updatePost(slug, {
        title: data.data.title ?? undefined,
        body: data.data.body ?? undefined,
        tags: data.data.tags ?? undefined,
        status: data.data.status ?? undefined
    });

    const author = await getById(updatedPost.authorId);

    res.status(200).json({
        post: {
            id: updatedPost.id,
            slug: updatedPost.slug,
            title: updatedPost.title,
            body: updatedPost.body,
            tags: updatedPost.tags,
            authorName: author?.name
        }
    });
};

export const removePost = async (req: ExtendedRequest, res: Response) => {

    const { slug } = req.params;

    const post = await getPostBySlug(slug);

    if(!post) {
        res.status(404).json({error: "Post não encontrado"});
        return;
    }

    await deletePost(slug);

    res.status(204);
};

export const getPosts = async (req: ExtendedRequest, res: Response) => {

    let page = 1;

    if(req.query.page) {
        page = parseInt(req.query.page as string);
        if(page <= 0) {
            res.status(400).json({error: "Pagina inexistente"});
            return;
        }
    }

    let posts = await getAllPosts(page);

    const postsToReturn = posts.map(post => ({
        id: post.id,
        title: post.title,
        body: post.body,
        tags: post.tags,
        slug: post.slug,
        status: post.status,
        authorName: post.author?.name,
        createdAt: post.createdAt,
    }))

    res.status(200).json({
        posts: postsToReturn,
        page
    })
};

export const getPost = async (req: ExtendedRequest, res: Response) => {

    const {slug} = req.params;

    const post = await getPostBySlug(slug);

    if(!post) {
        res.status(404).json({error: "Post não encontrado"});
        return;
    }

    res.status(200).json({
        id: post.id,
        title: post.title,
        body: post.body,
        status: post.status,
        tags: post.tags,
        authorName: post.author?.name,
        slug: post.slug,
        createdAt: post.createdAt
    })
};
