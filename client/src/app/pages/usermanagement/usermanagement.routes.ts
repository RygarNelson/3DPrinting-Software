import { Routes } from '@angular/router';
import { UserList } from './userlist';
import { UserCreate } from './usercreate';

export default [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'list', data: { breadcrumb: 'List' }, component: UserList },
    { path: 'create', data: { breadcrumb: 'Create' }, component: UserCreate }
] as Routes;
