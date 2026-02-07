import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome.page').then(m => m.WelcomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'preferences',
    loadComponent: () => import('./pages/preferences/preferences.page').then(m => m.PreferencesPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'map',
    loadComponent: () => import('./pages/map/map.page').then(m => m.MapPage)
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin/dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'admin/restaurant-form',
    loadComponent: () => import('./pages/admin/restaurant-form/restaurant-form.page').then(m => m.RestaurantFormPage)
  },
  {
    path: 'admin/analytics',
    loadComponent: () => import('./pages/admin/analytics/analytics.page').then(m => m.AnalyticsPage)
  },
];
