import { authMiddleware } from '@global/helpers/auth-middleware';
import { CreatePost } from '@post/controllers/create-post';
import { DeletePost } from '@post/controllers/delete-post';
import { Get } from '@post/controllers/get-posts';
import { Update } from '@post/controllers/update-post';
import express, { Router } from 'express';

class PostRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/post/all/:page', authMiddleware.checkAuthentication, Get.prototype.posts);
    this.router.get('/post/images/:page', authMiddleware.checkAuthentication, Get.prototype.postsWithImages);

    this.router.post('/post', authMiddleware.checkAuthentication, CreatePost.prototype.post);
    this.router.post('/post/image/post', authMiddleware.checkAuthentication, CreatePost.prototype.postWithImage);

    this.router.put('/post/:postId', authMiddleware.checkAuthentication, Update.prototype.posts);

    this.router.put('/post/image/:postId', authMiddleware.checkAuthentication, Update.prototype.postWithImage);

    this.router.delete('/post/:postId', authMiddleware.checkAuthentication, DeletePost.prototype.post);

    return this.router;
  }
}

export const postRoutes: PostRoutes = new PostRoutes();
