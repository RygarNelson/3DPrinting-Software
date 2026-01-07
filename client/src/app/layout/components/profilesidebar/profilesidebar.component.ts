import { LayoutService } from '@/layout/service/layout.service';
import { Component, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { User } from 'src/models/User';
import { AuthService } from 'src/services/auth.service';
import { LocalstorageService } from 'src/services/localstorage.service';

@Component({
  selector: '[app-profilesidebar]',
  imports: [ButtonModule, DrawerModule, BadgeModule],
  template: `
    <p-drawer [visible]="visible()" (onHide)="onDrawerHide()" position="right" [transitionOptions]="'.3s cubic-bezier(0, 0, 0.2, 1)'" styleClass="layout-profile-sidebar w-full sm:w-25rem lg:!w-[30rem]">
      <div class="flex flex-col mx-auto md:mx-0">
        <span class="mb-2 font-semibold">Benvenuto</span>
        <span class="text-surface-500 dark:text-surface-400 font-medium mb-8">{{ user.email }}</span>

        <ul class="list-none m-0 p-0">
          <li (click)="logout()">
            <a class="cursor-pointer flex mb-4 p-4 items-center border border-surface-200 rounded hover:bg-surface-100 transition-colors duration-150">
              <span>
                <i class="pi pi-power-off text-xl text-primary"></i>
              </span>
              <div class="ml-3">
                <span class="mb-2 font-semibold">Logout</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </p-drawer>
  `
})
export class AppProfileSidebar implements OnInit {
  public user: User = new User();

  constructor(
    public layoutService: LayoutService,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
    private localStorageService: LocalstorageService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUserInformation();
  }

  visible = computed(() => this.layoutService.layoutState().profileSidebarVisible);

  onDrawerHide() {
    this.layoutService.layoutState.update((state) => ({
      ...state,
      profileSidebarVisible: false
    }));
  }

  logout(): void {
    this.onDrawerHide();
    this.localStorageService.clear();
    setTimeout(
      () =>
        this.messageService.add({
          severity: 'success',
          detail: 'Logout effettuato correttamente!',
          life: 2000
        }),
      100
    );
    this.router.navigate(['/login']);
  }
}
