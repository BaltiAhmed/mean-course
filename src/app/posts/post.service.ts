import { Post } from './post.model'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs'
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: "root" })
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{ posts: Post[], postCount: number }>()

  constructor(private http: HttpClient, private router: Router) { }

  getPost(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any, maxPosts: number }>(
        "http://localhost:3000/api/posts" + queryParams
      )
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }), maxPosts: postData.maxPosts
        };
      }))
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postUpdated.next({ posts: [...this.posts], postCount: transformedPostData.maxPosts });
      });
  }

  getPostUpdated() {
    return this.postUpdated.asObservable()
  }

  getposts(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: String, creator: string }>(
      "http://localhost:3000/api/posts/" + id
    );

  }

  addPost(title: string, content: string, image: File, creator: string) {
    console.log(creator)
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    postData.append("creator", creator);
    this.http.post<{ message: String, post: any }>("http://localhost:3000/api/posts", postData)
      .subscribe(() => {
        this.router.navigate(["/"])

      })


  }

  deletePost(postId: string, creator: string) {
    return this.http.delete("http://localhost:3000/api/posts/" + postId + "/" + creator)

  }

  updatePost(postId: string, title: string, content: string, image: any, creator: string) {
    const userId = localStorage.getItem('userId')

    let postData: Post | FormData
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append("id", postId);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
      postData.append("creator", creator);
    } else {
      postData = {
        id: postId,
        title: title,
        content: content,
        imagePath: image,
        creator: creator
      }
    }
    this.http.put("http://localhost:3000/api/posts/" + postId, postData)
      .subscribe(response => {
        this.router.navigate(["/"])

      })


  }


}