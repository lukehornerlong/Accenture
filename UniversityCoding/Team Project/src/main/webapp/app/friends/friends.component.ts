import { Component, OnInit } from '@angular/core';
import { FriendsService } from 'app/entities/friends/service/friends.service';
import { IFriends } from 'app/entities/friends/friends.model';
import { AccountService } from 'app/core/auth/account.service';
import { PostService } from 'app/entities/post/service/post.service';
import { IPost } from 'app/entities/post/post.model';
@Component({
  selector: 'jhi-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit {
  friends: IFriends[] = [];
  posts: IPost[] = [];
  currentUser: any;
  constructor(private friendService: FriendsService, private accountService: AccountService, private postService: PostService) {}

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => {
      this.currentUser = account;
      console.log(this.currentUser.login);
    });

    this.friendService.query().subscribe(req => {
      this.friends = req.body?.filter(friend => friend.user_id1?.login === this.currentUser.login) ?? [];
      console.log(this.friends);

      const friendLogins = this.friends.map(friend => friend.user_id2?.login);

      // Filter the posts array based on the list of friend logins
      this.postService.query().subscribe(req => {
        this.posts = req.body?.filter(post => friendLogins.includes(post.user?.login)) ?? [];
      });
    });
  }
}
