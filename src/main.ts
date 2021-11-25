import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// global code-mirror import, as 
// instructed @ https://www.npmjs.com/package/@ctrl/ngx-codemirror
import 'codemirror/mode/javascript/javascript';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
