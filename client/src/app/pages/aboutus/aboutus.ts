import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-about-us',
    imports: [CommonModule],
    template: `
        <div class="card px-6 py-20 md:px-12 lg:px-20">
            <div class="flex flex-wrap mb-6">
                <div class="w-full lg:w-6/12 pl-0 lg:pr-6">
                    <img src="/demo/images/blocks/about/about-1.png" alt="Image" class="w-full rounded" />
                </div>
                <div class="w-full lg:w-6/12 pr-0 lg:pl-6 mt-4 lg:mt-0">
                    <div class="font-bold text-4xl mb-6 text-surface-900 dark:text-surface-0">About us</div>
                    <p class="leading-normal mt-0 mb-4 p-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p class="leading-normal mt-0 mb-4 p-0">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                        ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                        adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                    </p>
                    <p class="leading-normal my-0 p-0">
                        Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae
                        consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                    </p>
                </div>
            </div>
            <div class="mt-4 md:mt-20">
                <span class="block text-surface-900 dark:text-surface-0 font-bold text-3xl mb-4 text-center">Our Team</span>
                <div class="text-center text-lg leading-normal mb-12">Faucibus ornare suspendisse sed nisi. Nisl rhoncus mattis rhoncus urna neque viverra justo nec.</div>
                <div class="grid grid-cols-12 gap-4">
                    <div *ngFor="let member of teamMembers; let i = index" class="col-span-12 md:col-span-6 lg:col-span-3 p-4">
                        <div class="relative overflow-hidden" (mouseenter)="setVisibleMember(i)" (mouseleave)="setVisibleMember(-1)">
                            <img [src]="member.image" class="w-full block" alt="Team 2" />

                            <div
                                *ngIf="visibleMember === i"
                                class="absolute top-0 left-0 h-full w-full rounded animate-fadein animate-duration-300 select-none"
                                [ngStyle]="{
                                    backgroundColor: 'rgba(0,0,0,0.7)'
                                }"
                            >
                                <div class="flex flex-col p-8 h-full">
                                    <span class="block font-medium text-white text-xl mb-4">{{ member.name }}</span>
                                    <span class="font-medium text-surface-400 dark:text-surface-400">{{ member.role }}</span>
                                    <div class="mt-auto">
                                        <a *ngFor="let socialIcon of member.socialIcons" tabindex="0" class="cursor-pointer text-white">
                                            <i [ngClass]="socialIcon.iconClass" [class]="socialIcon.additionalClasses"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class AboutUs {
    visibleMember = -1;

    teamMembers = [
        {
            name: 'Jeff Davies',
            role: 'Software Developer',
            image: '/demo/images/blocks/team/team-1.png',
            socialIcons: [
                {
                    iconClass: 'pi pi-twitter',
                    additionalClasses: 'text-surface-200 text-xl mr-4'
                },
                {
                    iconClass: 'pi pi-github',
                    additionalClasses: 'text-surface-200 text-xl mr-4'
                },
                {
                    iconClass: 'pi pi-facebook',
                    additionalClasses: 'text-surface-200 text-xl'
                }
            ]
        },
        {
            name: 'Kristin Watson',
            role: 'UI/UX Designer',
            image: '/demo/images/blocks/team/team-2.png',
            socialIcons: [
                {
                    iconClass: 'pi pi-twitter',
                    additionalClasses: 'text-surface-200 text-xl mr-4'
                },
                {
                    iconClass: 'pi pi-github',
                    additionalClasses: 'text-surface-200 text-xl mr-4'
                },
                {
                    iconClass: 'pi pi-facebook',
                    additionalClasses: 'text-surface-200 text-xl'
                }
            ]
        },
        {
            name: 'Jenna Williams',
            role: 'Marketing Specialist',
            image: '/demo/images/blocks/team/team-3.png',
            socialIcons: [
                {
                    iconClass: 'pi pi-twitter',
                    additionalClasses: 'text-surface-200 text-xl mr-4'
                },
                {
                    iconClass: 'pi pi-github',
                    additionalClasses: 'text-surface-200 text-xl mr-4'
                },
                {
                    iconClass: 'pi pi-facebook',
                    additionalClasses: 'text-surface-200 text-xl'
                }
            ]
        },
        {
            name: 'Joe Clifford',
            role: 'Customer Relations',
            image: '/demo/images/blocks/team/team-4.png',
            socialIcons: [
                {
                    iconClass: 'pi pi-twitter',
                    additionalClasses: 'text-surface-200 text-xl mr-4'
                },
                {
                    iconClass: 'pi pi-github',
                    additionalClasses: 'text-surface-200 text-xl mr-4'
                },
                {
                    iconClass: 'pi pi-facebook',
                    additionalClasses: 'text-surface-200 text-xl'
                }
            ]
        }
    ];

    setVisibleMember(index: number): void {
        this.visibleMember = index;
    }
}
