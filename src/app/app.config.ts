import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Import HttpClientModule
import { routes } from './app.routes';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { provideStore } from '@ngxs/store';
import { AppState } from './store/app.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore(
      [AppState],
      withNgxsReduxDevtoolsPlugin(),
      withNgxsStoragePlugin({ keys: '*' })
    ),
  ],
};
