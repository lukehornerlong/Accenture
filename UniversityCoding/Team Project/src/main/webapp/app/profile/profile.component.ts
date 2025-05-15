import { Component, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { PostService } from 'app/entities/post/service/post.service';
import { IPost } from 'app/entities/post/post.model';
import { IUserExtra } from 'app/entities/user-extra/user-extra.model';
import { UserExtraService } from 'app/entities/user-extra/service/user-extra.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'app/entities/user/user.service';
import { IUser } from 'app/entities/user/user.model';
import { Router } from '@angular/router';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';
import { FriendsService } from 'app/entities/friends/service/friends.service';
import { IFriends, NewFriends } from 'app/entities/friends/friends.model';

import { faHamburger } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'jhi-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  bio: string =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  bioEntry: string = '';
  userExtra: IUserExtra[] = [];
  currentUser: any;
  currentUserID: any;
  avatarGen: string = '';
  posts: IPost[] = [];
  login = '';
  users: IUser[] = [];
  friends: IFriends[] = [];
  trackId = (_index: number, item: IUserExtra): number => this.userExtraService.getUserExtraIdentifier(item);

  faHamburger = faHamburger;

  viewerIsOwner: boolean = false;

  constructor(
    private accountService: AccountService,
    private postService: PostService,
    private userExtraService: UserExtraService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private friendsService: FriendsService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const login = params.get('login') ?? '';
      this.postService.query().subscribe(res => {
        this.posts = res.body?.filter(post => post.user?.login === login) ?? [];
      });

      this.userService.query().subscribe(req => {
        this.users = req.body ?? [];

        const user = this.users.find(u => u.login === login);

        if (!user) {
          // Redirect to 404 page
          this.router.navigate(['/404']);
          return;
        }
      });

      this.userExtraService.query().subscribe(req => {
        this.userExtra = req.body?.filter(user => user.user?.login === login) ?? [];
        this.friendsService.query().subscribe(req => {
          this.friends =
            req.body?.filter(
              friend => friend.user_id1?.login === this.currentUserID.login && friend.user_id2?.login === this.userExtra[0].user?.login
            ) ?? [];
          console.log('Friends ' + this.friends);
        });
      });
      this.login = login; // assign login to this.login
      this.avatarGen = createAvatar(initials, {
        seed: this.login,
      }).toDataUriSync();
    });

    this.accountService.identity().subscribe(account => {
      const isAuthenticated = this.accountService.isAuthenticated();
      if (isAuthenticated) {
        this.currentUser = account?.firstName + ' ' + account?.lastName;
        this.currentUserID = account;

        if (this.login === this.currentUserID.login) {
          console.log('You are the owner of this profile');
          this.viewerIsOwner = true;
        }
      }
    });
    console.log('Debug');
    for (const user of this.userExtra) {
      console.log(user.user?.login);
    }
  }

  updateBio(user: IUserExtra) {
    user.biography = this.bioEntry;
    this.userExtraService.updateUserExtra(user).subscribe();
    this.bioEntry = '';
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
          user.profilePic = base64Data;
          user.profilePicContentType = file.type;
          // Save the updated userExtra entity to the database here
          this.userExtraService.updateUserExtra(user).subscribe();
        });
        reader.readAsDataURL(file);
      }
    });
    fileInput.click();
  }

  saveChanges(user: IUserExtra) {
    this.userExtraService.updateUserExtra(user).subscribe(() => {
      console.log('Changes saved successfully');
    });
  }

  followUser(): void {
    const newFriends: NewFriends = {
      id: null,
      user_id1: this.currentUserID,
      user_id2: this.userExtra[0].user,
    };

    console.log("Current user's ID: " + this.currentUserID.login);
    console.log('User to follow: ' + this.userExtra[0].user?.login);

    // check if the friendship already exists
    this.friendsService.query().subscribe(req => {
      this.friends =
        req.body?.filter(
          friend => friend.user_id1?.login === this.currentUserID.login && friend.user_id2?.login === this.userExtra[0].user?.login
        ) ?? [];

      if (this.currentUserID.login === this.userExtra[0].user?.login) {
        console.log('You cannot follow yourself');
        return;
      }
      if (this.friends && this.friends.length > 0) {
        console.log('Friendship already exists');
        this.friends = this.friends;
        return;
      } else {
        // create new friendship
        this.friendsService.create(newFriends).subscribe(response => {
          console.log('Followed successfully');
          // fetch the updated list of friendships from the server
          const newFriends1: IFriends = {
            id: 0,
            user_id1: this.currentUserID,
            user_id2: this.userExtra[0].user,
          };

          const createdFriendship: IFriends = response.body!;

          this.friends.push(createdFriendship);
          console.log('Friends2 ' + this.friends);
        });
      }
    });
  }

  unfollowUser(): void {
    this.friendsService.query().subscribe(req => {
      console.log('Friends3 ' + this.friends);
      const friendToDelete = this.friends.find(
        friend => friend.user_id1?.login === this.currentUserID.login && friend.user_id2?.login === this.userExtra[0].user?.login
      );
      console.log('Friend to delete ' + friendToDelete?.id);

      if (!friendToDelete) {
        console.log('You are not following this user');
        return;
      }
      this.friendsService.delete(friendToDelete.id).subscribe(() => {
        console.log('Unfollowed successfully');
        const friendIndex = this.friends.indexOf(friendToDelete);

        // remove the friend from the array
        this.friends.splice(friendIndex, 1);
      });
    });
  }
}
