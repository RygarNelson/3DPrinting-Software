import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class FileAppService {
    constructor(private http: HttpClient) {}

    getFiles() {
        return this.http
            .get<any>('/demo/data/file-management.json')
            .toPromise()
            .then((res) => res.files as File[])
            .then((data) => data);
    }

    getMetrics() {
        return this.http
            .get<any>('/demo/data/file-management.json')
            .toPromise()
            .then((res) => res.metrics as any[])
            .then((data) => data);
    }

    getFoldersSmall() {
        return this.http
            .get<any>('/demo/data/file-management.json')
            .toPromise()
            .then((res) => res.folders_small as any[])
            .then((data) => data);
    }

    getFoldersLarge() {
        return this.http
            .get<any>('/demo/data/file-management.json')
            .toPromise()
            .then((res) => res.folders_large as any[])
            .then((data) => data);
    }
}
