import { Injectable } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { ActivatedRouteSnapshot, Resolve, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { RecipeService } from './recipe.service';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService {

  constructor( private dataStorageService: DataStorageService,
               private recipeService: RecipeService) { }

  resolve: ResolveFn<Recipe[]> = (route, state) => {
    const recipes = this.recipeService.getRecipes();
    if(recipes.length === 0){
      return this.dataStorageService.fetshRecipe();
    }else {
      return recipes;
    }
    
  }
}
