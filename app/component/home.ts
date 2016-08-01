import {Component} from 'angular2/core'
import {PostService} from '../service/post'
import {Post} from '../models'
import {LoginService} from '../service/login'
import {User} from '../models'

@Component({
    providers: [PostService],
    templateUrl: 'homeComponent.html'
})
export class HomeComponent {
    public posts: Array<Post>;
    private showLoading: boolean = false;

    constructor(private _postService: PostService,
        private _loginService: LoginService) {
        this.loadAllPosts();
    }

    loadAllPosts() {
        this.showLoading = true;
        this._postService.getPosts().subscribe(
            p => this.onLoadAllPostsResult(p),
            err => console.log(err)
        );
    }

    onLoadAllPostsResult(p) {
        console.log(p);
        this.posts = p;
        this.showLoading = false;
    }

    logout(event) {
        this._loginService.logout();
    }

    checkPost(p:Post):boolean {
        try {
            if (p.user == null) return false;
            if (!this._loginService.isLogged()) return false;
            return p.user._id == this._loginService.getUser()._id;
        } catch (error) {
            return false;
        }

        return false;
    }

    deletePost(p) {
        this._postService.delete(p).subscribe(
            result => this.onDeletePostResult(result),
            error => this.onDeletePostError(error)
        );
    }

    onDeletePostResult(result) {
        this.loadAllPosts();
    }

    onDeletePostError(error) {
        console.log(error);
    }

}