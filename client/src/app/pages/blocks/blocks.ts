import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockViewer } from './components/blockviewer';
import { Button } from 'primeng/button';
import { Chip } from 'primeng/chip';
import { InputText } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-blocks',
    standalone: true,
    imports: [CommonModule, BlockViewer, Button, Chip, InputText, Checkbox, FormsModule],
    template: `<div>
        <block-viewer header="Hero" [code]="block1" free>
            <div class="grid grid-cols-12 gap-4 grid-nogutter bg-surface-0 dark:bg-surface-950 text-surface-800 dark:text-surface-50">
                <div class="col-span-12 md:col-span-6 p-12 text-center md:text-left flex items-center">
                    <section>
                        <span class="block text-6xl font-bold mb-1">Create the screens </span>
                        <div class="text-6xl text-primary font-bold mb-4">your visitors deserve to see</div>
                        <p class="mt-0 mb-6 text-surface-700 dark:text-surface-100 leading-normal">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

                        <p-button label="Learn More" type="button" class="mr-4" raised></p-button>
                        <p-button label="Live Demo" type="button" outlined></p-button>
                    </section>
                </div>
                <div class="col-span-12 md:col-span-6 overflow-hidden">
                    <img src="/demo/images/blocks/hero/hero-1.png" alt="Image" class="md:ml-auto block md:h-full" style="clip-path: polygon(8% 0, 100% 0%, 100% 100%, 0 100%)" />
                </div>
            </div>
        </block-viewer>

        <block-viewer header="Feature" [code]="block2" free>
            <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20 text-center">
                <div class="mb-4 font-bold text-3xl">
                    <span class="text-surface-900 dark:text-surface-0">One Product, </span>
                    <span class="text-primary">Many Solutions</span>
                </div>
                <div class="text-surface-700 dark:text-surface-100 mb-12">Ac turpis egestas maecenas pharetra convallis posuere morbi leo urna.</div>
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-4 mb-6 px-8">
                        <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                            <i class="pi pi-desktop text-4xl text-primary"></i>
                        </span>
                        <div class="text-surface-900 dark:text-surface-0 text-xl mb-4 font-medium">Built for Developers</div>
                        <span class="text-surface-700 dark:text-surface-100 leading-normal">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span>
                    </div>
                    <div class="col-span-12 md:col-span-4 mb-6 px-8">
                        <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                            <i class="pi pi-lock text-4xl text-primary"></i>
                        </span>
                        <div class="text-surface-900 dark:text-surface-0 text-xl mb-4 font-medium">End-to-End Encryption</div>
                        <span class="text-surface-700 dark:text-surface-100 leading-normal">Risus nec feugiat in fermentum posuere urna nec. Posuere sollicitudin aliquam ultrices sagittis.</span>
                    </div>
                    <div class="col-span-12 md:col-span-4 mb-6 px-8">
                        <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                            <i class="pi pi-check-circle text-4xl text-primary"></i>
                        </span>
                        <div class="text-surface-900 dark:text-surface-0 text-xl mb-4 font-medium">Easy to Use</div>
                        <span class="text-surface-700 dark:text-surface-100 leading-normal">Ornare suspendisse sed nisi lacus sed viverra tellus. Neque volutpat ac tincidunt vitae semper.</span>
                    </div>
                    <div class="col-span-12 md:col-span-4 mb-6 px-8">
                        <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                            <i class="pi pi-globe text-4xl text-primary"></i>
                        </span>
                        <div class="text-surface-900 dark:text-surface-0 text-xl mb-4 font-medium">Fast & Global Support</div>
                        <span class="text-surface-700 dark:text-surface-100 leading-normal">Fermentum et sollicitudin ac orci phasellus egestas tellus rutrum tellus.</span>
                    </div>
                    <div class="col-span-12 md:col-span-4 mb-6 px-8">
                        <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                            <i class="pi pi-github text-4xl text-primary"></i>
                        </span>
                        <div class="text-surface-900 dark:text-surface-0 text-xl mb-4 font-medium">Open Source</div>
                        <span class="text-surface-700 dark:text-surface-100 leading-normal">Nec tincidunt praesent semper feugiat. Sed adipiscing diam donec adipiscing tristique risus nec feugiat. </span>
                    </div>
                    <div class="col-span-12 md:col-span-4 md:mb-6 mb-0 px-4">
                        <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                            <i class="pi pi-shield text-4xl text-primary"></i>
                        </span>
                        <div class="text-surface-900 dark:text-surface-0 text-xl mb-4 font-medium">Trusted Securitty</div>
                        <span class="text-surface-700 dark:text-surface-100 leading-normal">Mattis rhoncus urna neque viverra justo nec ultrices. Id cursus metus aliquam eleifend.</span>
                    </div>
                </div>
            </div>
        </block-viewer>

        <block-viewer header="Pricing" [code]="block3" free>
            <div class="bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
                <div class="text-surface-900 dark:text-surface-0 font-bold text-6xl mb-6 text-center">Pricing Plans</div>
                <div class="text-surface-700 dark:text-surface-100 text-xl mb-12 text-center leading-normal">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.</div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 lg:col-span-4">
                        <div class="p-4 h-full">
                            <div class="shadow p-4 h-full flex flex-col bg-surface-0 dark:bg-surface-900" style="border-radius: 6px">
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Basic</div>
                                <div class="text-surface-600 dark:text-surface-200">Plan description</div>
                                <hr class="my-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                                <div class="flex items-center">
                                    <span class="font-bold text-2xl text-surface-900 dark:text-surface-0">$9</span>
                                    <span class="ml-2 font-medium text-surface-600 dark:text-surface-200">per month</span>
                                </div>
                                <hr class="my-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                                <ul class="list-none p-0 m-0 flex-grow-1">
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-900 dark:text-surface-0">Arcu vitae elementum</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-900 dark:text-surface-0">Dui faucibus in ornare</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-900 dark:text-surface-0">Morbi tincidunt augue</span>
                                    </li>
                                </ul>
                                <hr class="mt-auto mb-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                                <p-button label="Buy Now" styleClass="p-4 w-full"></p-button>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 lg:col-span-4">
                        <div class="p-4 h-full">
                            <div class="shadow p-4 h-full flex flex-col bg-surface-0 dark:bg-surface-900" style="border-radius: 6px">
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Premium</div>
                                <div class="text-surface-600 dark:text-surface-200">Plan description</div>
                                <hr class="my-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                                <div class="flex items-center">
                                    <span class="font-bold text-2xl text-surface-900 dark:text-surface-0">$29</span>
                                    <span class="ml-2 font-medium text-surface-600 dark:text-surface-200">per month</span>
                                </div>
                                <hr class="my-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                                <ul class="list-none p-0 m-0 flex-grow-1">
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-900 dark:text-surface-0">Arcu vitae elementum</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-900 dark:text-surface-0">Dui faucibus in ornare</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-900 dark:text-surface-0">Morbi tincidunt augue</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-900 dark:text-surface-0">Duis ultricies lacus sed</span>
                                    </li>
                                </ul>
                                <hr class="mt-auto mb-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                                <p-button label="Buy Now" styleClass="p-4 w-full"></p-button>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 lg:col-span-4">
                        <div class="p-4 h-full">
                            <div class="shadow p-4 flex flex-col bg-surface-0 dark:bg-surface-900" style="border-radius: 6px">
                                <div class="text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Enterprise</div>
                                <div class="text-surface-600 dark:text-surface-200">Plan description</div>
                                <hr class="my-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                                <div class="flex items-center">
                                    <span class="font-bold text-2xl text-surface-900 dark:text-surface-0">$49</span>
                                    <span class="ml-2 font-medium text-surface-600 dark:text-surface-200">per month</span>
                                </div>
                                <hr class="my-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                                <ul class="list-none p-0 m-0 flex-grow-1">
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-900 dark:text-surface-0">Arcu vitae elementum</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-900 dark:text-surface-0">Dui faucibus in ornare</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-900 dark:text-surface-0">Morbi tincidunt augue</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-900 dark:text-surface-0">Duis ultricies lacus sed</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-900 dark:text-surface-0">Imperdiet proin</span>
                                    </li>
                                    <li class="flex items-center mb-4">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-900 dark:text-surface-0">Nisi scelerisque</span>
                                    </li>
                                </ul>
                                <hr class="mb-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                                <p-button label="Buy Now" styleClass="p-4 w-full" outlined></p-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </block-viewer>

        <block-viewer header="Call to Action" [code]="block4" free>
            <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
                <div class="text-surface-700 dark:text-surface-100 text-center">
                    <div class="text-primary font-bold mb-4"><i class="pi pi-discord"></i>&nbsp;POWERED BY DISCORD</div>
                    <div class="text-surface-900 dark:text-surface-0 font-bold text-5xl mb-4">Join Our Design Community</div>
                    <div class="text-surface-700 dark:text-surface-100 text-2xl mb-8">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.</div>
                    <p-button label="Join Now" icon="pi pi-discord" class="font-bold px-8 py-4 whitespace-nowrap" raised rounded></p-button>
                </div>
            </div>
        </block-viewer>

        <block-viewer header="Banner" [code]="block5" containerClass="bg-surface-0 dark:bg-surface-950 py-20" free>
            <div class="bg-slate-900 text-gray-100 p-4 flex justify-between lg:justify-center items-center flex-wrap">
                <div class="font-bold mr-20">🔥 Hot Deals!</div>
                <div class="items-center hidden lg:flex">
                    <span class="leading-normal">Libero voluptatum atque exercitationem praesentium provident odit.</span>
                </div>
                <a class="flex items-center ml-2 mr-20">
                    <a class="text-white" href="#"><span class="underline font-bold">Learn More</span></a>
                </a>
                <a class="flex items-center no-underline justify-center rounded-full text-gray-50 hover:bg-slate-700 cursor-pointer transition-colors duration-150" style="width: 2rem; height: 2rem">
                    <i class="pi pi-times"></i>
                </a>
            </div>
        </block-viewer>

        <div class="block-category-title">Application UI</div>
        <block-viewer header="Page Heading" [code]="block6" free>
            <div class="bg-surface-0 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
                <ul class="list-none p-0 m-0 flex items-center font-medium mb-4">
                    <li>
                        <a class="text-surface-500 dark:text-surface-300 no-underline leading-normal cursor-pointer">Application</a>
                    </li>
                    <li class="px-2">
                        <i class="pi pi-angle-right text-surface-500 dark:text-surface-300 leading-normal"></i>
                    </li>
                    <li>
                        <span class="text-surface-900 dark:text-surface-0 leading-normal">Analytics</span>
                    </li>
                </ul>
                <div class="flex items-start flex-col lg:justify-between lg:flex-row">
                    <div>
                        <div class="font-medium text-3xl text-surface-900 dark:text-surface-0">Customers</div>
                        <div class="flex items-center text-surface-700 dark:text-surface-100 flex-wrap">
                            <div class="mr-8 flex items-center mt-4">
                                <i class="pi pi-users mr-2"></i>
                                <span>332 Active Users</span>
                            </div>
                            <div class="mr-8 flex items-center mt-4">
                                <i class="pi pi-globe mr-2"></i>
                                <span>9402 Sessions</span>
                            </div>
                            <div class="flex items-center mt-4">
                                <i class="pi pi-clock mr-2"></i>
                                <span>2.32m Avg. Duration</span>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 lg:mt-0">
                        <p-button label="Add" styleClass="mr-2" outlined icon="pi pi-user-plus"></p-button>
                        <p-button label="Save" icon="pi pi-check"></p-button>
                    </div>
                </div>
            </div>
        </block-viewer>

        <block-viewer header="Stats" [code]="block7" free>
            <div class="bg-surface-50 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-6 lg:col-span-3">
                        <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded">
                            <div class="flex justify-between mb-4">
                                <div>
                                    <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Orders</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152</div>
                                </div>
                                <div class="flex items-center justify-center bg-blue-100 rounded" style="width: 2.5rem; height: 2.5rem">
                                    <i class="pi pi-shopping-cart text-primary text-xl"></i>
                                </div>
                            </div>
                            <span class="text-green-500 font-medium">24 new </span>
                            <span class="text-surface-500 dark:text-surface-300">since last visit</span>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-6 lg:col-span-3">
                        <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded">
                            <div class="flex justify-between mb-4">
                                <div>
                                    <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Revenue</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">$2.100</div>
                                </div>
                                <div class="flex items-center justify-center bg-orange-100 rounded" style="width: 2.5rem; height: 2.5rem">
                                    <i class="pi pi-map-marker text-orange-500 text-xl"></i>
                                </div>
                            </div>
                            <span class="text-green-500 font-medium">%52+ </span>
                            <span class="text-surface-500 dark:text-surface-300">since last week</span>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-6 lg:col-span-3">
                        <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded">
                            <div class="flex justify-between mb-4">
                                <div>
                                    <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Customers</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">28441</div>
                                </div>
                                <div class="flex items-center justify-center bg-cyan-100 rounded" style="width: 2.5rem; height: 2.5rem">
                                    <i class="pi pi-inbox text-cyan-500 text-xl"></i>
                                </div>
                            </div>
                            <span class="text-green-500 font-medium">520 </span>
                            <span class="text-surface-500 dark:text-surface-300">newly registered</span>
                        </div>
                    </div>
                    <div class="col-span-12 md:col-span-6 lg:col-span-3">
                        <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded">
                            <div class="flex justify-between mb-4">
                                <div>
                                    <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Comments</span>
                                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152 Unread</div>
                                </div>
                                <div class="flex items-center justify-center bg-purple-100 rounded" style="width: 2.5rem; height: 2.5rem">
                                    <i class="pi pi-comment text-purple-500 text-xl"></i>
                                </div>
                            </div>
                            <span class="text-green-500 font-medium">85 </span>
                            <span class="text-surface-500 dark:text-surface-300">responded</span>
                        </div>
                    </div>
                </div>
            </div>
        </block-viewer>

        <block-viewer header="Sign-In" [code]="block8" containerClass="bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20 flex items-center justify-center" free>
            <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded w-full lg:w-6/12">
                <div class="text-center mb-8">
                    <img src="/demo/images/blocks/logos/hyper.svg" alt="Image" height="50" class="mb-4 mx-auto" />
                    <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome Back</div>
                    <span class="text-surface-600 dark:text-surface-200 font-medium leading-normal">Don't have an account?</span>
                    <a class="font-medium no-underline ml-2 text-primary cursor-pointer">Create today!</a>
                </div>

                <div>
                    <label for="email1" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Email</label>
                    <input pInputText id="email1" type="text" placeholder="Email address" class="w-full mb-4" />

                    <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Password</label>
                    <input pInputText id="password1" type="password" placeholder="Password" class="w-full mb-4" />

                    <div class="flex items-center justify-between mb-12">
                        <div class="flex items-center">
                            <p-checkbox id="rememberme1" binary [(ngModel)]="checked" class="mr-2"></p-checkbox>
                            <label for="rememberme1" class="text-surface-900 dark:text-surface-0">Remember me</label>
                        </div>
                        <a class="font-medium no-underline ml-2 text-primary text-right cursor-pointer">Forgot password?</a>
                    </div>

                    <p-button label="Sign In" icon="pi pi-user" class="w-full"></p-button>
                </div>
            </div>
        </block-viewer>

        <block-viewer header="Description List" [code]="block9" containerClass="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20" free>
            <div class="bg-surface-0 dark:bg-surface-950">
                <div class="font-medium text-3xl text-surface-900 dark:text-surface-0 mb-4">Movie Information</div>
                <div class="text-surface-500 dark:text-surface-300 mb-8">Morbi tristique blandit turpis. In viverra ligula id nulla hendrerit rutrum.</div>
                <ul class="list-none p-0 m-0">
                    <li class="flex items-center py-4 px-2 border-t border-surface-200 dark:border-surface-700 flex-wrap">
                        <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Title</div>
                        <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">Heat</div>
                        <div class="w-6/12 md:w-2/12 flex justify-end">
                            <p-button label="Edit" icon="pi pi-pencil" text></p-button>
                        </div>
                    </li>
                    <li class="flex items-center py-4 px-2 border-t border-surface-200 dark:border-surface-700 flex-wrap">
                        <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Genre</div>
                        <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">
                            <p-chip label="Crime" styleClass="mr-2"></p-chip>
                            <p-chip label="Drama" styleClass="mr-2"></p-chip>
                            <p-chip label="Thriller"></p-chip>
                        </div>
                        <div class="w-6/12 md:w-2/12 flex justify-end">
                            <p-button label="Edit" icon="pi pi-pencil" text></p-button>
                        </div>
                    </li>
                    <li class="flex items-center py-4 px-2 border-t border-surface-200 dark:border-surface-700 flex-wrap">
                        <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Director</div>
                        <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">Michael Mann</div>
                        <div class="w-6/12 md:w-2/12 flex justify-end">
                            <p-button label="Edit" icon="pi pi-pencil" text></p-button>
                        </div>
                    </li>
                    <li class="flex items-center py-4 px-2 border-t border-surface-200 dark:border-surface-700 flex-wrap">
                        <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Actors</div>
                        <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">Robert De Niro, Al Pacino</div>
                        <div class="w-6/12 md:w-2/12 flex justify-end">
                            <p-button label="Edit" icon="pi pi-pencil" text></p-button>
                        </div>
                    </li>
                    <li class="flex items-center py-4 px-2 border-t border-b border-surface-200 dark:border-surface-700 flex-wrap">
                        <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Plot</div>
                        <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1 leading-normal">
                            A group of professional bank robbers start to feel the heat from police when they unknowingly leave a clue at their latest heist.
                        </div>
                        <div class="w-6/12 md:w-2/12 flex justify-end">
                            <p-button label="Edit" icon="pi pi-pencil" text></p-button>
                        </div>
                    </li>
                </ul>
            </div>
        </block-viewer>

        <block-viewer header="Card" [code]="block10" containerClass="px-6 py-20 md:px-12 lg:px-20" free>
            <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded">
                <div class="text-3xl font-medium text-surface-900 dark:text-surface-0 mb-4">Card Title</div>
                <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">Vivamus id nisl interdum, blandit augue sit amet, eleifend mi.</div>
                <div style="height: 150px" class="border-2 border-dashed border-surface-200 dark:border-surface-700"></div>
            </div>
        </block-viewer>
    </div>`
})
export class Blocks {
    block1: string = `
  <div class="grid grid-cols-12 gap-4 grid-nogutter bg-surface-0 dark:bg-surface-950 text-surface-800 dark:text-surface-50">
    <div class="col-span-12 md:col-span-6 p-12 text-center md:text-left flex items-center ">
        <section>
            <span class="block text-6xl font-bold mb-1">Create the screens </span>
            <div class="text-6xl text-primary font-bold mb-4">your visitors deserve to see</div>
            <p class="mt-0 mb-6 text-surface-700 dark:text-surface-100 leading-normal">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

            <p-button label="Learn More" type="button" class="mr-4" raised></p-button>
            <p-button label="Live Demo" type="button" outlined></p-button>
        </section>
    </div>
    <div class="col-span-12 md:col-span-6 overflow-hidden">
        <img src="/demo/images/blocks/hero/hero-1.png" alt="Image" class="md:ml-auto block md:h-full" style="clip-path: polygon(8% 0, 100% 0%, 100% 100%, 0 100%)">
    </div>
 </div>`;

    block2: string = `
  <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20 text-center">
    <div class="mb-4 font-bold text-3xl">
        <span class="text-surface-900 dark:text-surface-0">One Product, </span>
        <span class="text-primary">Many Solutions</span>
    </div>
    <div class="text-surface-700 dark:text-surface-100 mb-12">Ac turpis egestas maecenas pharetra convallis posuere morbi leo urna.</div>
    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 md:col-span-4 mb-6 px-8">
            <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                <i class="pi pi-desktop text-4xl text-primary"></i>
            </span>
            <div class="text-surface-900 dark:text-surface-0 text-xl mb-4 font-medium">Built for Developers</div>
            <span class="text-surface-700 dark:text-surface-100 leading-normal">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span>
        </div>
        <div class="col-span-12 md:col-span-4 mb-6 px-8">
            <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                <i class="pi pi-lock text-4xl text-primary"></i>
            </span>
            <div class="text-surface-900 dark:text-surface-0 text-xl mb-4 font-medium">End-to-End Encryption</div>
            <span class="text-surface-700 dark:text-surface-100 leading-normal">Risus nec feugiat in fermentum posuere urna nec. Posuere sollicitudin aliquam ultrices sagittis.</span>
        </div>
        <div class="col-span-12 md:col-span-4 mb-6 px-8">
            <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                <i class="pi pi-check-circle text-4xl text-primary"></i>
            </span>
            <div class="text-surface-900 dark:text-surface-0 text-xl mb-4 font-medium">Easy to Use</div>
            <span class="text-surface-700 dark:text-surface-100 leading-normal">Ornare suspendisse sed nisi lacus sed viverra tellus. Neque volutpat ac tincidunt vitae semper.</span>
        </div>
        <div class="col-span-12 md:col-span-4 mb-6 px-8">
            <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                <i class="pi pi-globe text-4xl text-primary"></i>
            </span>
            <div class="text-surface-900 dark:text-surface-0 text-xl mb-4 font-medium">Fast & Global Support</div>
            <span class="text-surface-700 dark:text-surface-100 leading-normal">Fermentum et sollicitudin ac orci phasellus egestas tellus rutrum tellus.</span>
        </div>
        <div class="col-span-12 md:col-span-4 mb-6 px-8">
            <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                <i class="pi pi-github text-4xl text-primary"></i>
            </span>
            <div class="text-surface-900 dark:text-surface-0 text-xl mb-4 font-medium">Open Source</div>
            <span class="text-surface-700 dark:text-surface-100 leading-normal">Nec tincidunt praesent semper feugiat. Sed adipiscing diam donec adipiscing tristique risus nec feugiat. </span>
        </div>
        <div class="col-span-12 md:col-span-4 md:mb-6 mb-0 px-4">
            <span class="p-4 shadow mb-4 inline-block bg-surface-0 dark:bg-surface-900" style="border-radius: 10px">
                <i class="pi pi-shield text-4xl text-primary"></i>
            </span>
            <div class="text-surface-900 dark:text-surface-0 text-xl mb-4 font-medium">Trusted Securitty</div>
            <span class="text-surface-700 dark:text-surface-100 leading-normal">Mattis rhoncus urna neque viverra justo nec ultrices. Id cursus metus aliquam eleifend.</span>
        </div>
    </div>
  </div>`;

    block3: string = `
  <div class="bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
    <div class="text-surface-900 dark:text-surface-0 font-bold text-6xl mb-6 text-center">Pricing Plans</div>
    <div class="text-surface-700 dark:text-surface-100 text-xl mb-12 text-center leading-normal">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.</div>

    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 lg:col-span-4">
            <div class="p-4 h-full">
                <div class="shadow p-4 h-full flex flex-col bg-surface-0 dark:bg-surface-900" style="border-radius: 6px">
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Basic</div>
                    <div class="text-surface-600 dark:text-surface-200">Plan description</div>
                    <hr class="my-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                    <div class="flex items-center">
                        <span class="font-bold text-2xl text-surface-900 dark:text-surface-0">$9</span>
                        <span class="ml-2 font-medium text-surface-600 dark:text-surface-200">per month</span>
                    </div>
                    <hr class="my-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                    <ul class="list-none p-0 m-0 flex-grow-1">
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Arcu vitae elementum</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Dui faucibus in ornare</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Morbi tincidunt augue</span>
                        </li>
                    </ul>
                    <hr class="mt-auto mb-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                    <p-button label="Buy Now" styleClass="p-4 w-full"></p-button>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-4">
            <div class="p-4 h-full">
                <div class="shadow p-4 h-full flex flex-col bg-surface-0 dark:bg-surface-900" style="border-radius: 6px">
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Premium</div>
                    <div class="text-surface-600 dark:text-surface-200">Plan description</div>
                    <hr class="my-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                    <div class="flex items-center">
                        <span class="font-bold text-2xl text-surface-900 dark:text-surface-0">$29</span>
                        <span class="ml-2 font-medium text-surface-600 dark:text-surface-200">per month</span>
                    </div>
                    <hr class="my-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                    <ul class="list-none p-0 m-0 flex-grow-1">
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Arcu vitae elementum</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Dui faucibus in ornare</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Morbi tincidunt augue</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Duis ultricies lacus sed</span>
                        </li>
                    </ul>
                    <hr class="mt-auto mb-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                    <p-button label="Buy Now" styleClass="p-4 w-full"></p-button>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-4">
            <div class="p-4 h-full">
                <div class="shadow p-4 flex flex-col bg-surface-0 dark:bg-surface-900" style="border-radius: 6px">
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Enterprise</div>
                    <div class="text-surface-600 dark:text-surface-200">Plan description</div>
                    <hr class="my-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                    <div class="flex items-center">
                        <span class="font-bold text-2xl text-surface-900 dark:text-surface-0">$49</span>
                        <span class="ml-2 font-medium text-surface-600 dark:text-surface-200">per month</span>
                    </div>
                    <hr class="my-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                    <ul class="list-none p-0 m-0 flex-grow-1">
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Arcu vitae elementum</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Dui faucibus in ornare</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Morbi tincidunt augue</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Duis ultricies lacus sed</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Imperdiet proin</span>
                        </li>
                        <li class="flex items-center mb-4">
                            <i class="pi pi-check-circle text-green-500 mr-2"></i>
                            <span class="text-surface-900 dark:text-surface-0">Nisi scelerisque</span>
                        </li>
                    </ul>
                    <hr class="mb-4 mx-0 border-t border-0 border-surface-200 dark:border-surface-700" />
                    <p-button label="Buy Now" styleClass="p-4 w-full" outlined></p-button>
                </div>
            </div>
        </div>
    </div>
  </div>`;

    block4: string = `
  <div class="bg-surface-0 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
    <div class="text-surface-700 dark:text-surface-100 text-center">
        <div class="text-primary font-bold mb-4"><i class="pi pi-discord"></i>&nbsp;POWERED BY DISCORD</div>
        <div class="text-surface-900 dark:text-surface-0 font-bold text-5xl mb-4">Join Our Design Community</div>
        <div class="text-surface-700 dark:text-surface-100 text-2xl mb-8">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.</div>
        <p-button label="Join Now" icon="pi pi-discord" class="font-bold px-8 py-4 whitespace-nowrap" raised rounded></p-button>
    </div>
  </div>`;

    block5: string = `
  <div class="bg-slate-900 text-gray-100 p-4 flex justify-between lg:justify-center items-center flex-wrap">
    <div class="font-bold mr-20">🔥 Hot Deals!</div>
    <div class="items-center hidden lg:flex">
        <span class="leading-normal">Libero voluptatum atque exercitationem praesentium provident odit.</span>
    </div>
    <a class="flex items-center ml-2 mr-20">
        <a class="text-white" href="#"><span class="underline font-bold">Learn More</span></a>
    </a>
    <a  class=" flex items-center no-underline justify-center rounded-full text-gray-50 hover:bg-slate-700 cursor-pointer transition-colors duration-150" style="width:2rem; height: 2rem">
        <i class="pi pi-times"></i>
    </a>
  </div>`;

    block6: string = `
  <div class="bg-surface-0 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
    <ul class="list-none p-0 m-0 flex items-center font-medium mb-4">
        <li>
            <a class="text-surface-500 dark:text-surface-300 no-underline leading-normal cursor-pointer">Application</a>
        </li>
        <li class="px-2">
            <i class="pi pi-angle-right text-surface-500 dark:text-surface-300 leading-normal"></i>
        </li>
        <li>
            <span class="text-surface-900 dark:text-surface-0 leading-normal">Analytics</span>
        </li>
    </ul>
    <div class="flex items-start flex-col lg:justify-between lg:flex-row">
        <div>
            <div class="font-medium text-3xl text-surface-900 dark:text-surface-0">Customers</div>
            <div class="flex items-center text-surface-700 dark:text-surface-100 flex-wrap">
                <div class="mr-8 flex items-center mt-4">
                    <i class="pi pi-users mr-2"></i>
                    <span>332 Active Users</span>
                </div>
                <div class="mr-8 flex items-center mt-4">
                    <i class="pi pi-globe mr-2"></i>
                    <span>9402 Sessions</span>
                </div>
                <div class="flex items-center mt-4">
                    <i class="pi pi-clock mr-2"></i>
                    <span>2.32m Avg. Duration</span>
                </div>
            </div>
        </div>
        <div class="mt-4 lg:mt-0">
            <p-button label="Add" styleClass="mr-2" outlined icon="pi pi-user-plus"></p-button>
            <p-button label="Save" icon="pi pi-check"></p-button>
        </div>
    </div>
  </div>`;

    block7: string = `
  <div class="bg-surface-50 dark:bg-surface-950 px-6 py-8 md:px-12 lg:px-20">
    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Orders</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 rounded" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-shopping-cart text-primary text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">24 new </span>
                <span class="text-surface-500 dark:text-surface-300">since last visit</span>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Revenue</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">$2.100</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 rounded" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-map-marker text-orange-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">%52+ </span>
                <span class="text-surface-500 dark:text-surface-300">since last week</span>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Customers</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">28441</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 rounded" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-inbox text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">520  </span>
                <span class="text-surface-500 dark:text-surface-300">newly registered</span>
            </div>
        </div>
        <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="bg-surface-0 dark:bg-surface-900 shadow p-4 rounded">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-surface-500 dark:text-surface-300 font-medium mb-4">Comments</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">152 Unread</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 rounded" style="width:2.5rem;height:2.5rem">
                        <i class="pi pi-comment text-purple-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-green-500 font-medium">85 </span>
                <span class="text-surface-500 dark:text-surface-300">responded</span>
            </div>
        </div>
    </div>
  </div>`;

    block8: string = `
  <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded w-full lg:w-6/12">
    <div class="text-center mb-8">
        <img src="/demo/images/blocks/logos/hyper.svg" alt="Image" height="50" class="mb-4">
        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome Back</div>
        <span class="text-surface-600 dark:text-surface-200 font-medium leading-normal">Don't have an account?</span>
        <a class="font-medium no-underline ml-2 text-primary cursor-pointer">Create today!</a>
    </div>

    <div>
        <label for="email1" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Email</label>
        <input pInputText id="email1" type="text" placeholder="Email address" class="w-full mb-4" />

        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium mb-2">Password</label>
        <input pInputText id="password1" type="password" placeholder="Password" class="w-full mb-4" />

        <div class="flex items-center justify-between mb-12">
            <div class="flex items-center">
                <p-checkbox id="rememberme1" [binary]="true" [(ngModel)]="checked" class="mr-2 block"></p-checkbox>
                <label for="rememberme1" class="text-surface-900 dark:text-surface-0">Remember me</label>
            </div>
            <a class="font-medium no-underline ml-2 text-primary text-right cursor-pointer">Forgot password?</a>
        </div>

        <p-button label="Sign In" icon="pi pi-user" class="w-full"></p-button>
    </div>
  </div>`;

    block9: string = `
  <div class="bg-surface-0 dark:bg-surface-950">
    <div class="font-medium text-3xl text-surface-900 dark:text-surface-0 mb-4">Movie Information</div>
    <div class="text-surface-500 dark:text-surface-300 mb-8">Morbi tristique blandit turpis. In viverra ligula id nulla hendrerit rutrum.</div>
    <ul class="list-none p-0 m-0">
        <li class="flex items-center py-4 px-2 border-t border-surface-200 dark:border-surface-700 flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Title</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">Heat</div>
            <div class="w-6/12 md:w-2/12 flex justify-end">
                <p-button label="Edit" icon="pi pi-pencil" text></p-button>
            </div>
        </li>
        <li class="flex items-center py-4 px-2 border-t border-surface-200 dark:border-surface-700 flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Genre</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">
                <p-chip label="Crime" styleClass="mr-2"></p-chip>
                <p-chip label="Drama" styleClass="mr-2"></p-chip>
                <p-chip label="Thriller"></p-chip>
            </div>
            <div class="w-6/12 md:w-2/12 flex justify-end">
                <p-button label="Edit" icon="pi pi-pencil" text></p-button>
            </div>
        </li>
        <li class="flex items-center py-4 px-2 border-t border-surface-200 dark:border-surface-700 flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Director</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">Michael Mann</div>
            <div class="w-6/12 md:w-2/12 flex justify-end">
                <p-button label="Edit" icon="pi pi-pencil" text></p-button>
            </div>
        </li>
        <li class="flex items-center py-4 px-2 border-t border-surface-200 dark:border-surface-700 flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Actors</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">Robert De Niro, Al Pacino</div>
            <div class="w-6/12 md:w-2/12 flex justify-end">
                <p-button label="Edit" icon="pi pi-pencil" text></p-button>
            </div>
        </li>
        <li class="flex items-center py-4 px-2 border-t border-b border-surface-200 dark:border-surface-700 flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Plot</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1 leading-normal">
                A group of professional bank robbers start to feel the heat from police
                when they unknowingly leave a clue at their latest heist.</div>
            <div class="w-6/12 md:w-2/12 flex justify-end">
                <p-button label="Edit" icon="pi pi-pencil" text></p-button>
            </div>
        </li>
    </ul>
  </div>`;

    block10: string = `
  <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded">
    <div class="text-3xl font-medium text-surface-900 dark:text-surface-0 mb-4">Card Title</div>
    <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">Vivamus id nisl interdum, blandit augue sit amet, eleifend mi.</div>
    <div style="height: 150px" class="border-2 border-dashed border-surface-200 dark:border-surface-700"></div>
  </div>`;

    checked: boolean = false;
}
