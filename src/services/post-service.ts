import slug from "slug"
import { prisma } from "../libs/prisma";
import { Prisma } from "../generated/prisma";

export const createPostSlug = async (title: string) => {

    let newSlug = slug(title);
    let keepTrying = true;
    let postCount = 1;

    while(keepTrying) {
        const post = await getPostBySlug(newSlug);
        if(!post) {
            keepTrying = false;
        } else {
            newSlug = slug(`${title} ${++postCount}`);
        }
    }
    return newSlug;
}

export const getPostBySlug = async (slug: string) => {
    return prisma.post.findUnique({
        where: {slug},
        include: {
            author: {
                select: {
                    name: true
                }
            }
        }
    })
}

type CreatePostProps = {
    authorId: number;
    slug: string;
    title: string;
    body: string;
    tags: string;
}

export const createPost = async (data: CreatePostProps) => {
    return await prisma.post.create({ data });
}

export const updatePost = async (slug: string, data: Prisma.PostUpdateInput) => {
    return await prisma.post.update({
        where: {slug},
        data
    });
}

export const deletePost = async (slug: string) => {
    return await prisma.post.delete({
        where: {slug}
    });
}

export const getAllPosts = async (page: number) => {
    let perPage = 5;
    const posts = await prisma.post.findMany({
        include: {
            author: {
                select: {name: true}
            }
        },
        orderBy: {createdAt: 'desc'},
        take: perPage,
        skip: (page - 1) * perPage
    });
    return posts;
}

export const getAllPublishedPosts = async (page: number) => {
    let perPage = 5;
    const posts = await prisma.post.findMany({
        where: {status: 'PUBLISHED'},
        include: {
            author: {
                select: {name: true}
            }
        },
        orderBy: {createdAt: 'desc'},
        take: perPage,
        skip: (page - 1) * perPage
    });
    return posts;
}