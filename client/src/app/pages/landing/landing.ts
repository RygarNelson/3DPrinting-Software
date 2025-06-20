import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { LayoutService } from '@/layout/service/layout.service';
import { AppConfigurator } from '@/layout/components/app.configurator';
import { TopbarWidget } from './components/topbarwidget.component';
import { HomeWidget } from './components/homewidget';
import { AppsWidget } from './components/appswidget';
import { PricingWidget } from './components/pricingwidget';
import { FeaturesWidget } from './components/featureswidget';
import { FooterWidget } from './components/footerwidget';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [
        RouterModule,
        ButtonModule,
        AppConfigurator,
        TopbarWidget,
        HomeWidget,
        AppsWidget,
        PricingWidget,
        FeaturesWidget,
        FooterWidget,
    ],
    template: `
        <div class="relative overflow-hidden flex flex-col justify-center">
            <div
                class="bg-circle opacity-50"
                [style]="{ top: '-200px', left: '-700px' }"
            ></div>
            <div
                class="bg-circle hidden lg:flex"
                [style]="{
                    top: '50px',
                    right: '-800px',
                    transform: 'rotate(60deg)',
                }"
            ></div>
            <div class="landing-wrapper">
                <topbar-widget />
                <div class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 z-20">
                    <home-widget />
                    <apps-widget />
                    <pricing-widget />
                    <features-widget />
                    <footer-widget />
                </div>
            </div>
        </div>

        <app-configurator [simple]="true"/>
    `,
    styles: [
        `
            .bg-circle {
                width: 1000px;
                height: 1000px;
                border-radius: 50%;
                background-image: linear-gradient(
                    140deg,
                    var(--primary-color),
                    var(--surface-ground) 80%
                );
                position: absolute;
                opacity: 0.25;
                z-index: -1;
            }
        `,
    ],
})
export class Landing {
    subscription: Subscription;

    darkMode: boolean = false;

    constructor(
        public router: Router,
        private layoutService: LayoutService,
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(
            (config) => {
                this.darkMode =
                    config.colorScheme === 'dark' ||
                    config.colorScheme === 'dim'
                        ? true
                        : false;
            },
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
