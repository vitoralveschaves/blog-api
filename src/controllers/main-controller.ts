import { RequestHandler } from "express";
import { getAllPublishedPosts, getPostBySlug } from "../services/post-service";

export const getAllPost: RequestHandler = async (req, res) => {

    let page = 1;

    if(req.query.page) {
        page = parseInt(req.query.page as string);
        if(page <= 0) {
            res.status(400).json({error: "Pagina inexistente"});
            return;
        }
    }

    const posts = await getAllPublishedPosts(page);

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

export const getPost: RequestHandler = async (req, res) => {

    const {slug} = req.params;
    
    const post = await getPostBySlug(slug);
    
    if(!post || (post && post.status == "DRAFT")) {
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
