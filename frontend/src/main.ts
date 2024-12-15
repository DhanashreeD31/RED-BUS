import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


  import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor() {}

  // Set the current theme in localStorage
  setTheme(theme: string): void {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }

  // Get the saved theme from localStorage
  getTheme(): string {
    return localStorage.getItem('theme') || 'light';  // Default to light if nothing saved
  }
}
