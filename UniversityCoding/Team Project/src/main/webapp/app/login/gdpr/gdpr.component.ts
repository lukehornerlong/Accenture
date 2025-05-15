import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-gdpr',
  templateUrl: './gdpr.component.html',
  styleUrls: ['./gdpr.component.scss'],
})
export class GdprComponent implements OnInit {
  constructor(private router: Router, private modalService: NgbModal) {}

  ngOnInit(): void {}

  onAgree() {
    // Store the user's agreement and navigate to the login page
    console.log('User agreed to GDPR');
    this.modalService.dismissAll();
    this.router.navigate(['/login']);
  }

  onDisagree() {
    // Simply close the modal
    console.log('User disagreed to GDPR');
    this.modalService.dismissAll();
  }
}
