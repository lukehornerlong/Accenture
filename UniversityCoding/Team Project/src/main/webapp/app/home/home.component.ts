import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { PostService } from 'app/entities/post/service/post.service';
import { IPost } from 'app/entities/post/post.model';
import { UserPantryService } from 'app/entities/user-pantry/service/user-pantry.service';
import { IUserPantry } from 'app/entities/user-pantry/user-pantry.model';
import { DietaryTagsService } from 'app/entities/dietary-tags/service/dietary-tags.service';
import { IDietaryTags } from 'app/entities/dietary-tags/dietary-tags.model';
@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  posts: IPost[] = [];
  currentUserID: any;
  pantryPosts: IUserPantry[] = [];
  postPantries: IPost[] = [];
  dietaryTags: IDietaryTags[] = [];
  filteredPosts: IPost[] = [];
  filteredPantryPosts: IPost[] = [];
  selectedDietaryTag: string | null = null;
  selectedPantryDietaryTag: string | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private postService: PostService,
    private userPantryService: UserPantryService,
    private dietaryTagsService: DietaryTagsService
  ) {}

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
    this.accountService.identity().subscribe(account => {
      const isAuthenticated = this.accountService.isAuthenticated();
      this.currentUserID = account;
      if (isAuthenticated) {
        this.postService.query().subscribe(res => {
          this.posts = res.body ?? [];
          this.filteredPosts = [...this.posts];
          this.selectedDietaryTag = ''; //just defaults the selection so it displays all
          console.log(this.filteredPosts);
        });
        this.dietaryTagsService.query().subscribe(req => {
          this.dietaryTags = req.body ?? [];
        });
        this.userPantryService.query().subscribe(req => {
          this.pantryPosts = req.body?.filter(user => user.user?.id === this.currentUserID.id) ?? [];
          const pantryPostsWithPosts = this.pantryPosts.filter(pp => pp.post); // filter out pantry posts without a post
          this.postPantries = pantryPostsWithPosts.map(pp => pp.post!); // get an array of IPost objects from the pantry posts
          this.filteredPantryPosts = [...this.postPantries];
          this.selectedPantryDietaryTag = '';

          //just defaults the selection so it displays all
        });
      }
    });
  }

  // deletePostFromPantry(postId: number): void {
  //   this.userPantryService.delete(this.pantryPosts.id)
  // }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onCardClick(postId: number): void {
    this.router.navigate(['/view', postId]);
  }
  toggleOverlay() {
    const overlay = document.querySelector('.overlay');
    const button = document.querySelector('.blue-button');
    const buttonholder = document.querySelector('.button-container');

    overlay?.classList.toggle('active');
    button?.classList.toggle('active');
    buttonholder?.classList.toggle('active');
    if (button?.textContent === '<<') {
      button.textContent = '>>';
    } else {
      // @ts-ignore
      button.textContent = '<<';
    }
  }

  filterPostsByDietaryTag() {
    console.log('filtering dietary posts');
    console.log(this.selectedDietaryTag);
    if (!this.selectedDietaryTag) {
      // if no dietary tag is selected, show all posts
      this.filteredPosts = [...this.posts];
    } else {
      // filter the posts that have the selected dietary tag
      this.filteredPosts = this.posts.filter(post => {
        console.log('Post' + post.dietaryTags); // add this line to check if the dietaryTags array is populated correctly
        return post.dietaryTags?.some(tag => tag.dietary === this.selectedDietaryTag);
      });
    }
  }
  filterPantryPostsByDietaryTag() {
    console.log('filtering pantry posts');
    console.log(this.selectedPantryDietaryTag);
    if (!this.selectedPantryDietaryTag) {
      // if no dietary tag is selected, show all posts
      this.filteredPantryPosts = [...this.postPantries];
    } else {
      // filter the posts that have the selected dietary tag
      const filteredPosts = this.posts.filter(post => {
        console.log('Post' + post.dietaryTags); // add this line to check if the dietaryTags array is populated correctly
        return post.dietaryTags?.some(tag => tag.dietary === this.selectedPantryDietaryTag);
      });
      // filter the pantry posts that have the same id as the filtered posts
      this.filteredPantryPosts = this.postPantries.filter(p => filteredPosts.some(f => f.id === p.id));
    }
  }

  calculateAverage(
    affordability: number | null | undefined,
    simplicity: number | null | undefined,
    shelfLife: number | null | undefined
  ): string {
    const a = affordability ?? 0;
    const b = simplicity ?? 0;
    const c = shelfLife ?? 0;
    const average = (a + b + c) / 3;
    return average.toFixed(1);
  }
}
