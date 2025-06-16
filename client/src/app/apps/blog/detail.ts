import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [CommonModule, FluidModule, IconFieldModule, InputIconModule, TextareaModule, InputTextModule, ButtonModule],
    template: ` <div class="card">
        <div class="flex justify-between flex-col-reverse md:flex-row items-center">
            <div>
                <div class="text-xl text-surface-900 dark:text-surface-0 mb-6 mt-6 md:mt-0 text-center md:text-left font-semibold md:pr-6">How To Get Started Tutorial</div>
                <div class="flex flex-wrap justify-center md:justify-start gap-4">
                    <span class="inline-flex items-center py-2 px-4 font-medium border border-surface-200 dark:border-surface-700 rounded">
                        <i class="pi pi-clock text-primary mr-2"></i>
                        <span class="text-surface-900 dark:text-surface-0">2d ago</span>
                    </span>
                    <span class="inline-flex items-center py-2 px-4 font-medium border border-surface-200 dark:border-surface-700 rounded">
                        <i class="pi pi-comments text-primary mr-2"></i>
                        <span class="text-surface-900 dark:text-surface-0">24</span>
                    </span>
                    <span class="inline-flex items-center py-2 px-4 font-medium border border-surface-200 dark:border-surface-700 rounded">
                        <i class="pi pi-eye text-primary mr-2"></i>
                        <span class="text-surface-900 dark:text-surface-0">124</span>
                    </span>
                </div>
            </div>
            <div class="flex flex-col items-center justify-center">
                <img class="w-16 h-16" src="/demo/images/avatar/circle/avatar-f-2@2x.png" alt="Avatar" />
                <span class="mt-4 font-bold text-surface-900 dark:text-surface-0 text-center whitespace-nowrap">Jane Cooper</span>
            </div>
        </div>
        <div class="text-center my-12">
            <img src="/demo/images/blog/blogdetail.png" alt="Image" class="w-full" />
        </div>
        <div class="text-2xl text-surface-900 dark:text-surface-0 mb-6 font-semibold">Sodales massa, morbi convallis</div>
        <p class="leading-normal text-lg mb-6">
            First, a disclaimer - the entire process of writing a blog post often takes more than a couple of hours, even if you can type eighty words per minute and your writing skills are sharp. From the seed of the idea to finally hitting
            “Publish,” you might spend several days or maybe even a week “writing” a blog post, but it&lsquo;s important to spend those vital hours planning your post and even thinking about Your Post(yes, thinking counts as working if you&lsquo;re a
            blogger) before you actually write it.
        </p>
        <p class="leading-normal text-lg mb-6">There&lsquo;s an old maxim that states, “No fun for the writer, no fun for the reader.”No matter what industry you&lsquo;re working in, as a blogger, you should live and die by this statement.</p>
        <p class="leading-normal text-lg mb-6">
            Before you do any of the following steps, be sure to pick a topic that actually interests you. Nothing - and I mean NOTHING- will kill a blog post more effectively than a lack of enthusiasm from the writer. You can tell when a writer is
            bored by their subject, and it&lsquo;s so cringe-worthy it&lsquo;s a little embarrassing.
        </p>
        <p class="leading-normal text-lg mb-6">
            I can hear your objections already. “But Dan, I have to blog for a cardboard box manufacturing company.” I feel your pain, I really do. During the course of my career, I&lsquo;ve written content for dozens of clients in some
            less-than-thrilling industries (such as financial regulatory compliance and corporate housing), but the hallmark of a professional blogger is the ability to write well about any topic, no matter how dry it may be. Blogging is a lot
            easier, however, if you can muster at least a little enthusiasm for the topic at hand.
        </p>
        <div class="text-2xl text-surface-900 dark:text-surface-0 mb-6 font-semibold">Commodo ultrices orci tempus et fermentum, pellentesque ultricies.</div>
        <ul class="text-xl p-0 my-0 ml-8">
            <li class="mb-4 leading-normal">Fermentum neque odio laoreet morbi sit. Venenatis in quam ut non.</li>
            <li class="mb-4 leading-normal">Enim in porta facilisi a vulputate fermentum, morbi. Consequat, id praesent tristique euismod pellentesque.</li>
            <li class="mb-4 leading-normal">Implements This is an external link</li>
            <li class="leading-normal">Scelerisque ultricies tincidunt lectus faucibus non morbi sed nibh varius. Quam a, habitasse egestaseleifend.</li>
        </ul>
        <div class="flex flex-col sm:flex-row my-20 w-full gap-4">
            <p-button icon="pi pi-twitter" severity="secondary" label="Twitter"></p-button>
            <p-button icon="pi pi-facebook" severity="secondary" label="Facebook"></p-button>
            <p-button (onClick)="navigateToEdit()" icon="pi pi-pencil" class="sm:ml-auto" label="Edit Post"></p-button>
        </div>
        <div class="flex items-center mb-6 font-bold">
            <span class="text-xl text-surface-900 dark:text-surface-0 mr-6">Comments</span>
            <span class="inline-flex items-center justify-center w-8 h-8 border border-surface-200 dark:border-surface-700 rounded">{{ comments.length }}</span>
        </div>
        <ul class="list-none p-0 m-0">
            <li *ngFor="let comment of comments; let i = index" [attr.key]="i" class="flex p-4 mb-4 border border-surface-200 dark:border-surface-700 rounded">
                <img [src]="comment.image" class="w-12 h-12 mr-4 flex-shrink-0" [alt]="'Image ' + i" />
                <div>
                    <span class="font-semibold text-surface-900 dark:text-surface-0">
                        {{ comment.name }}
                    </span>
                    <p class="font-semibold text-surface-600 dark:text-surface-200 m-0 text-sm">
                        {{ comment.date }}
                    </p>
                    <p class="leading-normal mb-0 my-4">
                        {{ comment.description }}
                    </p>
                </div>
            </li>
        </ul>
        <div class="text-xl text-surface-900 dark:text-surface-0 mb-6 font-bold mt-20">Post a Comment</div>

        <p-fluid>
            <p-iconfield class="mb-4">
                <p-inputicon class="pi pi-user" />
                <input pInputText type="text" placeholder="Name" />
            </p-iconfield>
        </p-fluid>
        <p-fluid>
            <p-iconfield class="mb-4">
                <p-inputicon class="pi pi-envelope" />
                <input pInputText type="text" placeholder="Email" />
            </p-iconfield>
        </p-fluid>
        <p-fluid>
            <textarea pTextarea [rows]="6" placeholder="Your comment" class="mb-4"></textarea>
        </p-fluid>
        <div class="flex justify-end">
            <p-button label="Post Comment"></p-button>
        </div>
    </div>`
})
export class Detail {
    constructor(private router: Router) {}

    comments = [
        {
            image: '/demo/images/avatar/circle/avatar-f-3@2x.png',
            name: 'Courtney Henry',
            date: '03 February 2022',
            description: 'Reprehenderit ut voluptas sapiente ratione nostrum est.'
        },
        {
            image: '/demo/images/avatar/circle/avatar-f-1@2x.png',
            name: 'Esther Howard',
            date: '03 February 2022',
            description: 'How likely are you to recommend our company to your friends and family ?'
        },
        {
            image: '/demo/images/avatar/circle/avatar-f-4@2x.png',
            name: 'Darlene Robertson',
            date: '03 February 2022',
            description: 'Quo quia sit nihil nemo doloremque et.'
        },
        {
            image: '/demo/images/avatar/circle/avatar-f-5@2x.png',
            name: 'Esther Howard',
            date: '03 February 2022',
            description: 'How likely are you to recommend our company to your friends and family ?'
        }
    ];

    navigateToEdit() {
        this.router.navigate(['apps/blog/edit']);
    }
}
