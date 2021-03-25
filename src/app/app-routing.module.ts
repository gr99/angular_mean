import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './Posts/post-lists/post-lists.component';
import { PostsCreateComponents } from './Posts/Posts-Create/posts-create.components';

const routes: Routes = [
    { path: '', component: PostListComponent },
    { path: 'create', component: PostsCreateComponents },
    { path: 'edit/:postId', component: PostsCreateComponents }

];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})

export class AppRoutingModule {

}
