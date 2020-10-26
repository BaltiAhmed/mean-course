import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs'

import {Post} from '../post.model'
import {PostService} from '../post.service'

@Component({
    selector:"app-post-list",
    templateUrl:"./post-list.component.html",
    styleUrls:["./post-list.component.css"]
})

export class PostList implements OnInit,OnDestroy {
    /* posts=[
        {title:'first post' ,content:'this is the first post content'},
        {title:'second post' ,content:'this is the second post content'},
        {title:'second post' ,content:'second is the first post content'}
    ] */

    posts: Post[]=[];
    private  postsub: Subscription;

    constructor(public postsService:PostService){}

    ngOnInit(){
        this.posts = this.postsService.getPost()
        this.postsService.getPostUpdated().subscribe((posts:Post[])=>{
            this.posts=posts    
        })
    }

    ngOnDestroy(){
        this.postsub.unsubscribe()
    }


}