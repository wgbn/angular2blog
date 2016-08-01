import {Injectable} from 'angular2/core'
import {User} from '../models'

@Injectable()
export class LoginService {
    private user:User = null;
    private token:string = null;

    constructor() { }

    setLogin(u:User, t:string){
        this.user = u;
        this.token = t;
    }

    getToken():string{
        return this.token;
    }

    getUser(){
        return this.user;
    }

    isLogged(){
        return this.user != null && this.token != null;
    }

    logout(){
        this.user = null;
        this.token = null;
    }
}