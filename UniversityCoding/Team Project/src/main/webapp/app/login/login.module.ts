import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { LOGIN_ROUTE } from './login.route';
import { LoginComponent } from './login.component';
import { GdprComponent } from './gdpr/gdpr.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [SharedModule, NgbModule, RouterModule.forChild([LOGIN_ROUTE])],
  declarations: [LoginComponent, GdprComponent],
})
export class LoginModule {}
