import {Component, OnInit} from '@angular/core';
import {PostModel} from '../post.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PostsService} from '../posts.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {mimeType} from './mime-type.validators';

@Component({
  selector: 'app-posts-create',
  styleUrls: ['./post-create.component.css'],
  templateUrl: './posts-create.component.html',
})
export class PostsCreateComponents implements OnInit {
  status = 'error';
  form: FormGroup;
  private mode = 'create';
  private postId: string;
  post: PostModel;
  public isLoading = false;
  private imagePreview: string | ArrayBuffer;
  // for know which url through the component is loaded
  // these is used for edit or create the post so we use ActivatedRoute

  constructor(public postService: PostsService, public route: ActivatedRoute, private fb: FormBuilder) {
  }

  ngOnInit() {
    //Reactive Form

    this.form = this.fb.group({
      //we set inital form value to null
      title: new FormControl(null,
        {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      // image: new FormControl(null, {validators: [Validators.required],asyncValidators:[mimeType]})
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });


    // it is observable we need to subscribe so if it is built in there is no need to unsubscribe
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((res) => {
          this.isLoading = false;
          this.post = {_id: res._id, title: res.title, content: res.content, imagePath: res.imagePath};
          //we override thee value in existing form,
          // using the set value we set value of all controls
          this.form.setValue({'title': this.post.title, 'content': this.post.content,
            'image': this.post.imagePath});
        }); // gate single post
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePeak(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    //patch value we set value to the specific controllers,we store file obj here
    this.form.patchValue({image: file});
    //informs the angular value is inserted and it also validate the file
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
    // console.log(file.type!="image/jpeg")
  }

  // ValidatePhone(control: AbstractControl): {[key: string]: any} | null
  // {
  //   const file=control.value;
  //   if (file) {
  //     console.log(file);
  //     if (file.type==="image/jpeg"&& file.size<=256000)
  //     {
  //       return null;
  //     }
  //   }
  //   return { 'fileisNotValid': true };
  // }

  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }
}
