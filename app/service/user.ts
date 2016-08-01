import {Http, HTTP_PROVIDERS, Headers} from 'angular2/http'
import {Injectable} from 'angular2/core'
import 'rxjs/add/operator/map'
import {User} from '../models'
import {HeadersService} from './header'

@Injectable()
export class UserService {
    constructor(private _http: Http, private _header:HeadersService) { }

    public insert(u:User) {
    return this._http
        .post('./api/login', JSON.stringify(u), this._header.getJsonHeaders())
            .map(res => res.json()
        );
    }
}