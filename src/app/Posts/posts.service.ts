import {PostModel} from './post.model';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';

import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostsService {
  constructor(private http: HttpClient, private route: Router) {
  }

  private posts: PostModel[] = [];
  private postsUpdated = new Subject<PostModel[]>();

  // it allows to retrive posts
  // tslint:disable-next-line:typedef
  getPosts() {
    this.http
      .get<{ msg: string; posts: PostModel[] }>('http://127.0.0.1:3000/post')
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  // get single post
  // tslint:disable-next-line:typedef
  getPost(postId: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(
      'http://127.0.0.1:3000/post/' + postId
    );
  }

  // add Posts
  addPost(title: string, content: string, image: File) {

    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
      .post<{ Done: string; post: PostModel }>(
        'http://127.0.0.1:3000/post',
        postData
      )
      .subscribe((postData) => {
        // console.log("This is receved DATA after POST",postData.Done);
        const post: PostModel = {_id: postData.post._id, title: title, content: content, imagePath: postData.post.imagePath};
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.route.navigate(['/']);
      });
  }

  // delete Posts
  deletePosts(postId: string) {
    this.http
      .delete<{ message: string; removedId: string }>(
        'http://127.0.0.1:3000/post/' + postId
      )
      .subscribe((postMessage) => {
        const updatedPosts = this.posts.filter((post) => post._id != postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  // update post
  updatePost(_id: string, title: string, content: string, image: any)
  {
    let postData:PostModel|FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append("_id",_id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        _id: _id, title: title, content: content, imagePath: image
      };
    }
    this.http
      .put('http://127.0.0.1:3000/post/' + _id, postData)
      .subscribe((message) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p=> p._id === _id);
        const post:PostModel= {
          _id: _id, title: title, content: content, imagePath:""
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.route.navigate(['/']);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
}
