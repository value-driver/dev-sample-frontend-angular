import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LucideShieldCheck } from '@lucide/angular';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, RouterLink, LucideShieldCheck],
  template: `
    <div class="min-h-screen flex flex-col justify-between bg-[#F6F7F9] text-[#101828] p-4 sm:p-6">
      <header class="flex items-center justify-between mx-auto w-full max-w-4xl">
        <a routerLink="/" class="flex items-center gap-3 text-inherit no-underline">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1350DF] text-white">
            <svg lucideShieldCheck class="h-[18px] w-[18px]" aria-hidden="true"></svg>
          </div>
          <div class="flex items-center gap-2.5 whitespace-nowrap">
            <span class="text-[15px] font-semibold tracking-tight text-[#101828]">ValueDriver</span>
            <span class="h-4 w-px bg-[#D2D2D2]" aria-hidden="true"></span>
            <span class="text-[13px] font-medium text-[#667085]">Reference</span>
          </div>
        </a>
      </header>

      <main class="my-auto flex justify-center py-6">
        <div class="w-full max-w-sm">
          <router-outlet />
        </div>
      </main>

      <footer class="text-center text-xs text-[#98A2B3]">
        <p class="m-0">VD Angular Reference</p>
      </footer>
    </div>
  `,
})
export class AuthLayoutComponent {}
