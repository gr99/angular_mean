import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {PostModel} from '../post.model';
import {PostsService} from '../posts.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-lists.component.html',
  styleUrls: ['./post-lists.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  public isLoading=false;
  posts: PostModel[] = [];
  private postsSub: Subscription;

  constructor(public postService: PostsService) {
  }

  ngOnInit() {
    this.isLoading=true;
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListener().subscribe(
      (posts: PostModel[]) => {
        this.isLoading=false;
        this.posts = posts;
      }
    );
  }
  async onDelete(postId:string){
    await this.postService.deletePosts(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
