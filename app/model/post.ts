import {User} from '../models'

export class Post {
    public _id: string;
    public title: string;
    public user: User;
    public body: string;
    public date: Date;

    constructor(){

    }
}