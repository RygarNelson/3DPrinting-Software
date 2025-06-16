import { Component } from '@angular/core';

@Component({
    selector: 'features-widget',
    standalone: true,
    imports: [],
    template: `
        <div id="features" class="my-12 py-12 md:my-20 md:py-20">
            <span
                class="text-surface-900 dark:text-surface-0 block font-bold text-5xl mb-6 text-center"
                >Features</span
            >
            <span
                class="text-surface-700 dark:text-surface-100 block text-xl mb-20 text-center leading-normal"
                >PrimeTek Informatics is the author of PrimeVue, a UI Component
                vendor with well known vastly popular projects including
                PrimeFaces, PrimeNG and PrimeReact.</span
            >

            <div class="grid grid-cols-12 gap-4 mt-20">
                <div
                    class="col-span-12 md:col-span-6 xl:col-span-3 flex justify-center p-4"
                >
                    <div
                        class="box p-6 w-full bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 border rounded"
                    >
                        <img
                            src="/demo/images/landing/icon-components.svg"
                            alt="components icon"
                            class="block mb-4"
                        />
                        <span
                            class="text-surface-900 dark:text-surface-0 block font-semibold mb-4 text-lg"
                            >90+ UI Components</span
                        >
                        <p
                            class="m-0 text-secondary text-surface-700 dark:text-surface-100"
                        >
                            The ultimate set of UI Components to assist you with
                            90+ impressive Vue Components.
                        </p>
                    </div>
                </div>
                <div
                    class="col-span-12 md:col-span-6 xl:col-span-3 flex justify-center p-4"
                >
                    <div
                        class="box p-6 w-full bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 border rounded"
                    >
                        <img
                            src="/demo/images/landing/icon-community.svg"
                            alt="components icon"
                            class="block mb-4"
                        />
                        <span
                            class="text-surface-900 dark:text-surface-0 block font-semibold mb-4 text-lg"
                            >Community</span
                        >
                        <p
                            class="m-0 text-secondary text-surface-700 dark:text-surface-100"
                        >
                            Connect with the other open source community
                            members, collaborate and have a voice in the project
                            roadmap.
                        </p>
                    </div>
                </div>
                <div
                    class="col-span-12 md:col-span-6 xl:col-span-3 flex justify-center p-4"
                >
                    <div
                        class="box p-6 w-full bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 border rounded"
                    >
                        <img
                            src="/demo/images/landing/icon-productivity.svg"
                            alt="components icon"
                            class="block mb-4"
                        />
                        <span
                            class="text-surface-900 dark:text-surface-0 block font-semibold mb-4 text-lg"
                            >Productivity</span
                        >
                        <p
                            class="m-0 text-secondary text-surface-700 dark:text-surface-100"
                        >
                            Boost your productivity by achieving more in less
                            time and accomplish amazing results.
                        </p>
                    </div>
                </div>
                <div
                    class="col-span-12 md:col-span-6 xl:col-span-3 flex justify-center p-4"
                >
                    <div
                        class="box p-6 w-full bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 border rounded"
                    >
                        <img
                            src="/demo/images/landing/icon-accessibility.svg"
                            alt="components icon"
                            class="block mb-4"
                        />
                        <span
                            class="text-surface-900 dark:text-surface-0 block font-semibold mb-4 text-lg"
                            >Accessibility</span
                        >
                        <p
                            class="m-0 text-secondary text-surface-700 dark:text-surface-100"
                        >
                            The ultimate set of UI Components to assist you with
                            90+ impressive Vue Components.
                        </p>
                    </div>
                </div>
                <div
                    class="col-span-12 md:col-span-6 xl:col-span-3 flex justify-center p-4"
                >
                    <div
                        class="box p-6 w-full bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 border rounded"
                    >
                        <img
                            src="/demo/images/landing/icon-support.svg"
                            alt="components icon"
                            class="block mb-4"
                        />
                        <span
                            class="text-surface-900 dark:text-surface-0 block font-semibold mb-4 text-lg"
                            >Enterprise Support</span
                        >
                        <p
                            class="m-0 text-secondary text-surface-700 dark:text-surface-100"
                        >
                            Exceptional support service featuring response
                            within 1 business day and option to request
                            enhancements and new features for the library.
                        </p>
                    </div>
                </div>
                <div
                    class="col-span-12 md:col-span-6 xl:col-span-3 flex justify-center p-4"
                >
                    <div
                        class="box p-6 w-full bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 border rounded"
                    >
                        <img
                            src="/demo/images/landing/icon-mobile.svg"
                            alt="components icon"
                            class="block mb-4"
                        />
                        <span
                            class="text-surface-900 dark:text-surface-0 block font-semibold mb-4 text-lg"
                            >Mobile</span
                        >
                        <p
                            class="m-0 text-secondary text-surface-700 dark:text-surface-100"
                        >
                            First class support for responsive design led by
                            touch optimized elements.
                        </p>
                    </div>
                </div>
                <div
                    class="col-span-12 md:col-span-6 xl:col-span-3 flex justify-center p-4"
                >
                    <div
                        class="box p-6 w-full bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 border rounded"
                    >
                        <img
                            src="/demo/images/landing/icon-theme.svg"
                            alt="components icon"
                            class="block mb-4"
                        />
                        <span
                            class="text-surface-900 dark:text-surface-0 block font-semibold mb-4 text-lg"
                            >Themes</span
                        >
                        <p
                            class="m-0 text-secondary text-surface-700 dark:text-surface-100"
                        >
                            Built on a design-agnostic api, choose from a vast
                            amount of themes such as material, bootstrap, custom
                            or develop your own.
                        </p>
                    </div>
                </div>
                <div
                    class="col-span-12 md:col-span-6 xl:col-span-3 flex justify-center p-4"
                >
                    <div
                        class="box p-6 w-full bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 border rounded"
                    >
                        <img
                            src="/demo/images/landing/icon-ts.svg"
                            alt="components icon"
                            class="block mb-4"
                        />
                        <span
                            class="text-surface-900 dark:text-surface-0 block font-semibold mb-4 text-lg"
                            >Typescript</span
                        >
                        <p
                            class="m-0 text-secondary text-surface-700 dark:text-surface-100"
                        >
                            Top-notch support for Typescript with types and
                            tooling assistance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class FeaturesWidget {}
