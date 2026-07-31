import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'theme';

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  isDark(): boolean {
    return this.document.documentElement.classList.contains('my-app-dark');
  }

  setDarkMode(enable: boolean): void {
    const html = this.document.documentElement;

    html.classList.toggle('my-app-dark', enable);

    localStorage.setItem(this.storageKey, enable ? 'dark' : 'light');
  }

  toggle(): void {
    this.setDarkMode(!this.isDark());
  }

  init(): void {
    const saved = localStorage.getItem(this.storageKey);

    if (saved === 'dark' || saved === 'light') {
      this.setDarkMode(saved === 'dark');
      return;
    }

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    this.setDarkMode(prefersDark);
  }
}