import {Component} from 'angular2/core'
import {ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig} from 'angular2/router'
import {HomeComponent,LoginComponent,AddPostComponent} from './component'

@Component({
    selector: 'my-app',
    providers: [ROUTER_PROVIDERS],
    directives: [ROUTER_DIRECTIVES],
    templateUrl:'appComponent.html',
})
@RouteConfig([
    { path: '/', name: 'Home', component: HomeComponent, useAsDefault: true },
    { path: '/Login', name: 'Login', component: LoginComponent },
    { path: '/Addpost', name: 'AddPost', component: AddPostComponent }
])
export class AppComponent {
    private titulo:string;

    constructor(){
        // aqui init
    }
}