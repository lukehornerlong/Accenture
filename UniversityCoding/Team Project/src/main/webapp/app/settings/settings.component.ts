import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { UserExtraService } from 'app/entities/user-extra/service/user-extra.service';
import { AllergensService } from 'app/entities/allergens/service/allergens.service';

import { IUserExtra } from 'app/entities/user-extra/user-extra.model';
import { IAllergens } from 'app/entities/allergens/allergens.model';
import { IUser } from 'app/entities/user/user.model';

import { ActivatedRoute } from '@angular/router';
import { UserService } from 'app/entities/user/user.service';
import { Router } from '@angular/router';

import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';

import { faGear, faLock, faHamburger } from '@fortawesome/free-solid-svg-icons';
import { MainComponent } from '../layouts/main/main.component';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  icons = {
    gear: faGear,
    lock: faLock,
    hamburger: faHamburger,
  };

  currentUser: any;
  currentUserID: any;
  userExtra: any;
  userAllergens: any;
  avatar: string = '';

  login = '';
  users: IUser[] = [];

  username: string = '';
  forename: string = '';
  surname: string = '';
  email: string = '';

  biography: string = '';

  userExtraExists = false;
  userAllergensExists = false;

  allergensBypass: string[] = ['id', 'user', 'post'];
  allergensLanding: any;

  allergensModified: string[] = [];

  fontSize: string = '16';
  theme: 'light' | 'dark' = 'light';

  constructor(
    public mainComponent: MainComponent,
    private accountService: AccountService,
    private userExtraService: UserExtraService,
    private userAllergensService: AllergensService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.accountService.identity().subscribe(account => {
        const isAuthenticated = this.accountService.isAuthenticated();
        if (isAuthenticated) {
          this.currentUser = account?.firstName + ' ' + account?.lastName;
          this.currentUserID = account;
        }
      });
      this.userService.query().subscribe(req => {
        this.users = req.body ?? [];
        const user = this.users.find(u => u.login === this.login);
        // if (!user) {
        //   // Redirect to 404 page
        //   this.router.navigate(['/404']);
        //   return;
        // }
      });
      this.userExtraService.query().subscribe(req => {
        this.userExtra = req.body?.filter(user => user.user?.login === this.login)[0] ?? null;
        if (this.userExtra) {
          this.userExtraExists = true;
          this.avatar = 'data:' + this.userExtra.profilePicContentType + ';base64,' + this.userExtra.profilePic ?? '';
          this.biography = this.userExtra.biography ?? '';
        } else {
          this.userExtraExists = false;
        }
      });

      this.userAllergensService.query().subscribe(req => {
        this.userAllergens = req.body?.filter(user => user.user?.login === this.login)[0] ?? null;

        for (const property in this.userAllergens) {
          if (!this.allergensBypass.includes(property)) {
            // Allergens bypass contains the properties that are not allergens

            let el = document.createElement('a');
            el.onclick = () => this.handleAllergen(property);

            el.id = 'allergens-group-' + property;

            el.classList.add('border');
            el.classList.add('btn');
            el.classList.add('border-dark');
            el.classList.add('rounded');
            el.classList.add('m-1');
            el.classList.add('text-center');
            el.classList.add('col-sm-2');
            el.classList.add(this.userAllergens[property] ? 'bg-danger' : 'bg-success');

            el.innerHTML += "<h6 class='mb-0 mt-1'>" + property.charAt(0).toUpperCase() + property.substr(1).toLowerCase() + '</h6>';

            document.getElementById('allergens-landing')?.appendChild(el);
          }
        }

        if (this.userAllergens) {
          this.userAllergensExists = true;
        } else {
          this.userAllergensExists = false;
        }
      });

      this.login = this.currentUserID.login;
    });

    var headingLinks = document.querySelectorAll('[id^="headings-link-"]');

    function clearActive() {
      headingLinks.forEach(element => {
        if (element != null) if (element.id != 'headings-link-div') element.classList.remove('active');
      });
    }

    this.username = this.currentUserID.login;
    this.forename = this.currentUserID.firstName;
    this.surname = this.currentUserID.lastName;
    this.email = this.currentUserID.email;

    this.avatar = createAvatar(initials, {
      seed: this.forename + ' ' + this.surname,
    }).toDataUriSync();

    headingLinks.forEach(element => {
      if (element.tagName == 'A') {
        element.addEventListener('click', function (event) {
          clearActive();
          let el = event.target as HTMLElement;
          if (el != null) {
            el.classList.add('active');
          }
        });
      }
    });

    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      this.fontSize = savedFontSize;
      this.applyFontSize(this.fontSize);
    }
    this.theme = this.mainComponent.themeMode;
  }
  applyFontSize(size: string): void {
    document.documentElement.style.setProperty('--font-size', `${size}px`);
  }

  changeFontSize(size: string): void {
    this.fontSize = size;
    this.mainComponent.changeFontSize(size);
  }

  toggleThemeMode(): void {
    this.theme = this.mainComponent.themeMode;
    this.mainComponent.toggleThemeMode();
  }

  saveChanges(): void {
    // Save the font size to local storage
    localStorage.setItem('fontSize', this.fontSize);
    localStorage.setItem('theme', this.theme);
    console.log('Changes saved');

    // Update bio
    if (this.userExtra) this.updateBio(this.userExtra);
    if (this.userAllergens) this.updateAllergens(this.userAllergens);
    // this.updateName(this.currentUserID);
    alert('Changes saved');
  }

  updateBio(user: IUserExtra) {
    user.biography = this.biography;
    this.userExtraService.updateUserExtra(user).subscribe();
  }

  updateAllergens(userAllergens: IAllergens) {
    // This is probably really innefficient coding but it works.
    if (this.allergensModified.includes('celery')) {
      userAllergens.celery = !userAllergens.celery;
    }
    if (this.allergensModified.includes('crustaceans')) {
      userAllergens.crustaceans = !userAllergens.crustaceans;
    }
    if (this.allergensModified.includes('eggs')) {
      userAllergens.egg = !userAllergens.egg;
    }
    if (this.allergensModified.includes('fish')) {
      userAllergens.fish = !userAllergens.fish;
    }
    if (this.allergensModified.includes('gluten')) {
      userAllergens.gluten = !userAllergens.gluten;
    }
    if (this.allergensModified.includes('lupin')) {
      userAllergens.lupin = !userAllergens.lupin;
    }
    if (this.allergensModified.includes('milk')) {
      userAllergens.milk = !userAllergens.milk;
    }
    if (this.allergensModified.includes('molluscs')) {
      userAllergens.molluscs = !userAllergens.molluscs;
    }
    if (this.allergensModified.includes('mustard')) {
      userAllergens.mustard = !userAllergens.mustard;
    }
    if (this.allergensModified.includes('nuts')) {
      userAllergens.nuts = !userAllergens.nuts;
    }
    if (this.allergensModified.includes('peanuts')) {
      userAllergens.peanuts = !userAllergens.peanuts;
    }
    if (this.allergensModified.includes('sesame')) {
      userAllergens.sesame = !userAllergens.sesame;
    }
    if (this.allergensModified.includes('soya')) {
      userAllergens.soya = !userAllergens.soya;
    }
    if (this.allergensModified.includes('sulphur')) {
      userAllergens.sulphur = !userAllergens.sulphur;
    }
    this.userAllergensService.update(userAllergens).subscribe();
    this.allergensModified = [];
  }

  updateName(user: IUser) {
    console.log('Deprecated');
    // let accountT: any;
    // this.accountService.identity().subscribe(account => {
    //   const isAuthenticated = this.accountService.isAuthenticated();
    //   if (isAuthenticated) {
    //     accountT = account;
    //     accountT.firstName = this.forename;
    //     accountT.lastName = this.surname;
    //     accountT.email = this.email;
    //     this.accountService.save(accountT).subscribe(() => {
    //       this.accountService.authenticate(accountT);
    //     });
    //   }
    // });
  }

  changeProfilePic(user: IUserExtra) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const base64Data = (reader.result as string).split(',')[1];
          this.avatar = 'data:' + file.type + ';base64,' + base64Data;
          user.profilePic = base64Data;
          user.profilePicContentType = file.type;
          // Save the updated userExtra entity to the database here
          console.log('Profile picture changed');
          this.userExtraService.updateUserExtra(user).subscribe();
        });
        reader.readAsDataURL(file);
      }
    });
    fileInput.click();
  }

  handleAllergen(input: any) {
    document.getElementById('allergens-group-' + input)?.classList.toggle('bg-danger');
    document.getElementById('allergens-group-' + input)?.classList.toggle('bg-success');

    if (!this.allergensModified.includes(input)) {
      this.allergensModified.push(input);
    } else {
      this.allergensModified.splice(this.allergensModified.indexOf(input), 1);
    }
  }
}
