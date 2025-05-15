import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDietaryTags } from '../dietary-tags.model';

@Component({
  selector: 'jhi-dietary-tags-detail',
  templateUrl: './dietary-tags-detail.component.html',
})
export class DietaryTagsDetailComponent implements OnInit {
  dietaryTags: IDietaryTags | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dietaryTags }) => {
      this.dietaryTags = dietaryTags;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
