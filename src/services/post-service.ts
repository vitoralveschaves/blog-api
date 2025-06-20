import slug from "slug"
import { prisma } from "../libs/prisma";

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
    return await prisma.post.create({ data })
}