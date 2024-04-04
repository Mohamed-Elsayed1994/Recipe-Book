import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { exhaustMap, map, take, tap } from 'rxjs';
import { AuthService } from '../Auth/auth.service';


@Injectable({
  providedIn: 'root'
})

export class DataStorageService {

  constructor(private http: HttpClient, 
              private recipeService: RecipeService,
              private authService: AuthService) { }

  storeRecipe(){
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://my-first-app-62550-default-rtdb.firebaseio.com/recipes.json',
     recipes).subscribe(response => {
      console.log(response);
     });
  }

  fetshRecipe(){
    return this.authService.user.pipe(take(1),exhaustMap(user => {
      return  this.http.get<Recipe[]>(
        'https://my-first-app-62550-default-rtdb.firebaseio.com/recipes.json',
        {
          params: new HttpParams().set('auth', user.token)
        });

    }),map(recipes =>{
      return recipes.map(recipe => {
        return{
          ...recipe, 
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      });
    }),
    tap(recipes => {
      this.recipeService.setRecipes(recipes);

    }));
    
  
  }
}

