import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'user-extra',
        data: { pageTitle: 'teamprojectApp.userExtra.home.title' },
        loadChildren: () => import('./user-extra/user-extra.module').then(m => m.UserExtraModule),
      },
      {
        path: 'post',
        data: { pageTitle: 'teamprojectApp.post.home.title' },
        loadChildren: () => import('./post/post.module').then(m => m.PostModule),
      },
      {
        path: 'dietary-tags',
        data: { pageTitle: 'teamprojectApp.dietaryTags.home.title' },
        loadChildren: () => import('./dietary-tags/dietary-tags.module').then(m => m.DietaryTagsModule),
      },
      {
        path: 'recipe',
        data: { pageTitle: 'teamprojectApp.recipe.home.title' },
        loadChildren: () => import('./recipe/recipe.module').then(m => m.RecipeModule),
      },
      {
        path: 'user-pantry',
        data: { pageTitle: 'teamprojectApp.userPantry.home.title' },
        loadChildren: () => import('./user-pantry/user-pantry.module').then(m => m.UserPantryModule),
      },
      {
        path: 'comment',
        data: { pageTitle: 'teamprojectApp.comment.home.title' },
        loadChildren: () => import('./comment/comment.module').then(m => m.CommentModule),
      },
      {
        path: 'ingredient',
        data: { pageTitle: 'teamprojectApp.ingredient.home.title' },
        loadChildren: () => import('./ingredient/ingredient.module').then(m => m.IngredientModule),
      },
      {
        path: 'liked-by',
        data: { pageTitle: 'teamprojectApp.likedBy.home.title' },
        loadChildren: () => import('./liked-by/liked-by.module').then(m => m.LikedByModule),
      },
      {
        path: 'friends',
        data: { pageTitle: 'teamprojectApp.friends.home.title' },
        loadChildren: () => import('./friends/friends.module').then(m => m.FriendsModule),
      },
      {
        path: 'allergens',
        data: { pageTitle: 'teamprojectApp.allergens.home.title' },
        loadChildren: () => import('./allergens/allergens.module').then(m => m.AllergensModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
