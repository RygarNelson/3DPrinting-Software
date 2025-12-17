import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    NavigationEnd,
    Router,
    RouterModule,
} from '@angular/router';

import { BehaviorSubject, filter } from 'rxjs';

interface Breadcrumb {
    id: string;
    label: string;
    url?: string;
}

@Component({
    selector: '[app-breadcrumb]',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `<nav class="layout-breadcrumb">
          <ol>
            @for (item of breadcrumbs$ | async; track item.id; let last = $last) {
              <li>{{ item.label }}</li>
              @if (!last) {
                <li class="layout-breadcrumb-chevron">/</li>
              }
            }
          </ol>
        </nav>`,
})
export class AppBreadcrumb {
    private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

    readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

    constructor(private router: Router) {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event) => {
                const root = this.router.routerState.snapshot.root;
                const breadcrumbs: Breadcrumb[] = [];
                this.addBreadcrumb(root, [], breadcrumbs);

                this._breadcrumbs$.next(breadcrumbs);
            });
    }

    private addBreadcrumb(
        route: ActivatedRouteSnapshot,
        parentUrl: string[],
        breadcrumbs: Breadcrumb[],
    ) {
        const routeUrl = parentUrl.concat(route.url.map((url) => url.path));
        const breadcrumb = route.data['breadcrumb'];
        const parentBreadcrumb =
            route.parent && route.parent.data
                ? route.parent.data['breadcrumb']
                : null;

        if (breadcrumb && breadcrumb !== parentBreadcrumb) {
            breadcrumbs.push({
                id: routeUrl.join('/'),
                label: route.data['breadcrumb'],
                url: '/' + routeUrl.join('/'),
            });
        }

        if (route.firstChild) {
            this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
        }
    }
}
