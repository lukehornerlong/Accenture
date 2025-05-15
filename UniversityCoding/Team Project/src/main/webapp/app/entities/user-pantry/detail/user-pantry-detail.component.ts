import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserPantry } from '../user-pantry.model';

@Component({
  selector: 'jhi-user-pantry-detail',
  templateUrl: './user-pantry-detail.component.html',
})
export class UserPantryDetailComponent implements OnInit {
  userPantry: IUserPantry | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userPantry }) => {
      this.userPantry = userPantry;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
