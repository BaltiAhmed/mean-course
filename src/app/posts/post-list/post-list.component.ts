import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs'
import { AuthService } from 'src/app/auth/auth.service';

import { Post } from '../post.model'
import { PostService } from '../post.service'

@Component({
    selector: "app-post-list",
    templateUrl: "./post-list.component.html",
    styleUrls: ["./post-list.component.css"]
})

export class PostList implements OnInit,OnDestroy {
    /* posts=[
        {title:'first post' ,content:'this is the first post content'},
        {title:'second post' ,content:'this is the second post content'},
        {title:'second post' ,content:'second is the first post content'}
    ] */

    posts: Post[] = [];
    private postsub: Subscription;
    isLoading = false;
    totalPosts = 0;
    postsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10]
    userIsAuth = false
    private userIsCreator: String

    private authListenerSubs: Subscription

    constructor(public postsService: PostService, private authService: AuthService) { }

    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPost(this.postsPerPage, this.currentPage)
        this.postsService.getPostUpdated().subscribe((postData: { posts: Post[], postCount: number }) => {
            this.isLoading = false
            this.totalPosts = postData.postCount
            this.posts = postData.posts
        });
        this.userIsCreator = localStorage.getItem('userId')
        console.log(this.totalPosts)
        this.userIsAuth = this.authService.getIsAuth()
        this.authListenerSubs = this.authService.getAuthStatusListener()
        .subscribe(isAuth =>{
            this.userIsAuth = isAuth
        })
    }

    ngOnDestroy(){
        this.authListenerSubs.unsubscribe()
    }



    onDelete(postId: string,creator: string) {
        this.isLoading = true;
        this.postsService.deletePost(postId,creator).subscribe(() => {
            this.postsService.getPost(this.postsPerPage, this.currentPage)
        })




    }
    onChangePage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize
        this.postsService.getPost(this.postsPerPage, this.currentPage)
    }


}