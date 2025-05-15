import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { UserExtraService } from 'app/entities/user-extra/service/user-extra.service';
import { IUserExtra } from 'app/entities/user-extra/user-extra.model';

@Component({
  selector: 'jhi-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private accountService: AccountService,
    private userExtraService: UserExtraService
  ) {}

  post: any;
  userExtra: IUserExtra[] = [];
  currentUserID: any;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const postId = params.get('id');
      this.http.get(`api/posts/${postId}`).subscribe((res: any) => {
        this.post = res;
      });
      this.accountService.identity().subscribe(account => {
        this.currentUserID = account;
        this.userExtraService.query().subscribe(req => {
          this.userExtra = req.body?.filter(user => user.user?.id === this.currentUserID.id) ?? [];
        });
      });
    });
  }
}
