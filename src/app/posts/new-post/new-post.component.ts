import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from '../../models/post';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent implements OnInit{
  permalink : string = '';
  imgSrc: any = "./assets/istockphoto-1147544807-612x612.jpg";
  selectedImg: any = "";

  categories: Array<any> | undefined;
  postForm!: FormGroup;
  post: any;
  formStatus: string = 'Add New';
  docId!: string;

  constructor( 
    private categoryService: CategoriesService, 
    private fb: FormBuilder, 
    private postService: PostsService,
    private route: ActivatedRoute ) {
      this.route.queryParams.subscribe(val => {
        // console.log(val);
        this.docId = val['id'];

        if(this.docId){
          this.postService.loadOneData(val['id']).subscribe(post => {
            this.post = post;
            // console.log(post);
  
            this.postForm = this.fb.group({ 
              title: [this.post.title, [Validators.required, Validators.minLength(10)]],
              permalink: [this.post.permalink, Validators.required],
              excerpt: [this.post.excerpt, [Validators.required, Validators.minLength(50)]],
              category: [`${this.post.category.categoryId}-${this.post.category.category}`, Validators.required],
              postImg: ['', Validators.required],
              content: [this.post.content, Validators.required]
            })
            this.imgSrc = this.post.postImgPath;
            this.formStatus = 'Edit';
          });
        } else {
          this.postForm = this.fb.group({ 
            title: ['', [Validators.required, Validators.minLength(10)]],
            permalink: ['', Validators.required],
            excerpt: ['', [Validators.required, Validators.minLength(50)]],
            category: ['', Validators.required],
            postImg: ['', Validators.required],
            content: ['', Validators.required]
          })
        }
      })
  }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe(val => {
      this.categories = val;
    })
  }

  get fc() {
    return this.postForm?.controls;
  }

  onTitleChanged($event: any) {
    // console.log($event.target.value);

    const title = $event.target.value;
    this.permalink = title.replace(/\s/g, '-');
  }

  showPreview ($event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
    }

    reader.readAsDataURL($event.target.files[0]);
    this.selectedImg = $event.target.files[0];
  }

  onSubmit(){
    console.log(this.postForm.value);

    let splitted=this.postForm.value.category.split('-');
    console.log(splitted);

    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.permalink,
      category: {
        categoryId: splitted[0],
        category: splitted[1]
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date()
    }
    this.postService.uploadImage(this.selectedImg, postData, this.formStatus, this.docId);
    // console.log(postData);
    this.postForm.reset();
    this.imgSrc = './assets/istockphoto-1147544807-612x612.jpg';
  }

}
