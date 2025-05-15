import { Component, OnInit, RendererFactory2, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import dayjs from 'dayjs/esm';

import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {
  fontSize: string = '16';

  themeMode: 'light' | 'dark' = 'light';

  private renderer: Renderer2;

  constructor(
    private accountService: AccountService,
    private titleService: Title,
    private router: Router,
    private translateService: TranslateService,
    rootRenderer: RendererFactory2
  ) {
    this.renderer = rootRenderer.createRenderer(document.querySelector('html'), null);
  }

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe(() => {
      if (!this.accountService.isAuthenticated()) {
        this.router.navigate(['/login']);
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateTitle();
      }
    });

    this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.updateTitle();
      dayjs.locale(langChangeEvent.lang);
      this.renderer.setAttribute(document.querySelector('html'), 'lang', langChangeEvent.lang);
    });

    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      this.applyFontSize(savedFontSize);
    }

    this.themeMode = (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light';

    this.applyThemeMode(this.themeMode);
  }

  applyFontSize(size: string): void {
    document.documentElement.style.setProperty('--global-font-size', `${size}px`);
  }

  changeFontSize(size: string): void {
    this.fontSize = size;
    this.applyFontSize(size);
  }

  // check if user is logged in or not as a component for Angular
  isLoggedIn(): boolean {
    return this.accountService.isAuthenticated();
  }

  private getPageTitle(routeSnapshot: ActivatedRouteSnapshot): string {
    const title: string = routeSnapshot.data['pageTitle'] ?? '';
    if (routeSnapshot.firstChild) {
      return this.getPageTitle(routeSnapshot.firstChild) || title;
    }
    return title;
  }

  private updateTitle(): void {
    let pageTitle = this.getPageTitle(this.router.routerState.snapshot.root);
    if (!pageTitle) {
      pageTitle = 'global.title';
    }
    this.translateService.get(pageTitle).subscribe(title => this.titleService.setTitle(title));
  }
  applyThemeMode(mode: 'light' | 'dark'): void {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  }

  toggleThemeMode(): void {
    this.themeMode = this.themeMode === 'dark' ? 'light' : 'dark';
    this.applyThemeMode(this.themeMode);
    localStorage.setItem('themeMode', this.themeMode);
  }
}
