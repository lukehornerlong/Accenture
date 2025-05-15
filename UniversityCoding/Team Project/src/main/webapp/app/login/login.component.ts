import { Component, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';

import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

//modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GdprComponent } from './gdpr/gdpr.component';

@Component({
  selector: 'jhi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('username', { static: false })
  username!: ElementRef;

  //icons
  faUtensils = faUtensils;
  faTriangleExclamation = faTriangleExclamation;

  authenticationError = false;

  // toast
  show = false;

  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rememberMe: new FormControl(false, { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // if already authenticated then navigate to home page
    this.accountService.identity().subscribe(() => {
      if (this.accountService.isAuthenticated()) {
        this.router.navigate(['']);
      }
    });

    // toast
    this.showDisclaimer();
  }

  ngAfterViewInit(): void {
    this.username.nativeElement.focus();
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
          this.login();
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

  //toast
  showDisclaimer() {
    this.show = true;
  }

  login(): void {
    this.loginService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.authenticationError = false;
        if (!this.router.getCurrentNavigation()) {
          // There were no routing during login (eg from navigationToStoredUrl)
          this.router.navigate(['']);
        }
      },
      error: () => (this.authenticationError = true),
    });
  }
}
