import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILikedBy } from '../liked-by.model';

@Component({
  selector: 'jhi-liked-by-detail',
  templateUrl: './liked-by-detail.component.html',
})
export class LikedByDetailComponent implements OnInit {
  likedBy: ILikedBy | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ likedBy }) => {
      this.likedBy = likedBy;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
