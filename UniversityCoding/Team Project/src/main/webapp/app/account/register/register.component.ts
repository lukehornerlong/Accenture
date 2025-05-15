import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/config/error.constants';
import { RegisterService } from './register.service';

import { faUser, faEnvelope, faKey, faLock } from '@fortawesome/free-solid-svg-icons';

//modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GdprComponent } from '../../login/gdpr/gdpr.component';

import { Router } from '@angular/router';
import { LoginService } from '../../login/login.service';

@Component({
  selector: 'jhi-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements AfterViewInit {
  @ViewChild('login', { static: false })
  login?: ElementRef;

  doNotMatch = false;
  error = false;
  errorEmailExists = false;
  errorUserExists = false;
  success = false;

  faUser = faUser;
  faEnvelope = faEnvelope;
  faKey = faKey;
  faLock = faLock;

  // toast
  show = false;
  checkboxTOS = false;

  registerForm = new FormGroup({
    login: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),

    confirmTOS: new FormControl(false),
  });

  constructor(
    private translateService: TranslateService,
    private registerService: RegisterService,
    private modalService: NgbModal,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    if (this.login) {
      this.login.nativeElement.focus();
    }
  }

  //modal
  openPrivacyModal(): void {
    console.log('openPrivacyModal()');
    const modalRef = this.modalService.open(GdprComponent, {
      fullscreen: 'md',
      size: 'lg',
      scrollable: true,
      centered: true,
      modalDialogClass: 'modal-custom-dialog prevent-select',
    });
    console.log('modalRef: ', modalRef);
    console.log('modalRef.result: ', modalRef.result);
    console.log('gdprcomponent: ', GdprComponent);

    modalRef.result.then(
      result => {
        if (result === 'agree') {
          // User agreed to GDPR
          console.log('User agreed to GDPR');
        } else {
          // User disagreed to GDPR
          console.log('User disagreed to GDPR');
          modalRef.close();
        }
      },
      reason => {
        // Modal dismissed without clicking either button
        console.log('Privacy modal dismissed');
      }
    );
  }

  register(): void {
    this.doNotMatch = false;
    this.error = false;
    this.errorEmailExists = false;
    this.errorUserExists = false;

    const { password, confirmPassword } = this.registerForm.getRawValue();
    if (password !== confirmPassword) {
      this.doNotMatch = true;
    } else {
      const { login, email } = this.registerForm.getRawValue();
      this.registerService.save({ login, email, password, langKey: this.translateService.currentLang }).subscribe({
        next: () => {
          this.loginService.login({ username: login, password, rememberMe: false }).subscribe(
            () => {
              this.router.navigate(['']);
              this.success = true;
            },
            error => this.processError(error)
          );
        },
        error: response => this.processError(response),
      });
    }
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
      this.errorUserExists = true;
    } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
      this.errorEmailExists = true;
    } else {
      this.error = true;
    }
  }
}
