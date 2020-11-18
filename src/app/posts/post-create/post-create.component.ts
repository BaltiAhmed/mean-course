import { Component, OnInit} from '@angular/core'
import {FormControl, FormGroup, NgForm, Validator, Validators} from '@angular/forms'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import {mimeType} from './mime-type.validator'

import { PostService } from '../post.service';


@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

    entredContent = '';
    entredTitle = '';
    private mode = 'create';
    private postId = null;
    post: Post;
    isLoading= false;
    form: FormGroup;
    imagePreview:string;
    
    
    constructor (public postsService: PostService,public route:ActivatedRoute){}

    ngOnInit(){
        this.form=new FormGroup({
            'title':new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
            'content':new FormControl(null,{validators:[Validators.required]}),
            'image':new FormControl(null,{validators:[Validators.required],asyncValidators:[mimeType]})
        })
        this.route.paramMap.subscribe((paramMap:ParamMap)=>{
            if(paramMap.has('postId')){
                this.mode ='edit';
                this.postId=paramMap.get('postId')
                this.isLoading=true
                this.postsService.getposts(this.postId).subscribe(postData =>{
                    this.isLoading=false;
                    
                    this.post = {id: postData._id,title: postData.title, content:postData.content,imagePath:postData.imagePath,creator:postData.creator};
                    
                    this.form.setValue({'title':this.post.title,'content':this.post.content,image:this.post.imagePath})
                })
            }else{
                this.mode='create';
                this.postId= null;
            }

        });
    }

    onSavepost() {
        if(this.form.invalid){
            return;
        }
        const creator =localStorage.getItem('userId')
        this.isLoading=true;
        if(this.mode==='create'){
            this.postsService.addPost(this.form.value.title,this.form.value.content,this.form.value.image,creator)
        }else{
            this.postsService.updatePost(this.postId,this.form.value.title,this.form.value.content,this.form.value.image,creator)
        }
       
       this.form.reset() 
    }

    onImagePicked(event:Event){
        const file =(event.target as HTMLInputElement).files[0];
        this.form.patchValue({image:file});
        this.form.get('image').updateValueAndValidity();
        const reader =  new FileReader()
        reader.onload=()=>{
            this.imagePreview = reader.result.toString()
        }
        reader.readAsDataURL(file)
    }

}