import {Component} from 'angular2/core'
import {Post} from '../models'
import {LoginService} from '../service/login'
import {Router} from 'angular2/router'
import {PostService} from '../service/post'

@Component({
    providers: [PostService],
    templateUrl: 'addpostComponent.html'
})
export class AddPostComponent {
    private post:Post = new Post();
    private errorMessage:string = null;
    private showLoading:boolean = false;

    constructor(private _loginService:LoginService, private _router:Router, private _postService:PostService) {
        if (!_loginService.isLogged())
            this._router.navigate(['Login']);
        this.post.user = this._loginService.getUser();
    }

    onClick(event){
        event.preventDefault();
        this.showLoading = true;
        this.errorMessage = null;

        this._postService.insert(this.post).subscribe(
            result => this.onInsertPostResult(result),
            error => this.onInsertPostError(error)
        );
    }

    onInsertPostResult(result){
        this._router.navigate(['Home']);
    }

    onInsertPostError(error){
        this.showLoading = false;
        this.errorMessage = error._body;
    }
}