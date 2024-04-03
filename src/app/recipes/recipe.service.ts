import { Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredients.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Subject } from "rxjs";
@Injectable()

export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();
  private recipes: Recipe[]=[];

 // private recipes: Recipe[]=[
 //   new Recipe('A spaggity Recipe','This is a delisions',
  //  'assets/BB1keSH2.jpg',[
  //    new Ingredient('MEAT',1),
 //     new Ingredient('Fries',20)
   // ]),
 //   new Recipe('A Test 2 Recipe','This is a Test',
 //   'assets/BB1keSH2.jpg',[
  //    new Ingredient('MEAT',1),
 //   new Ingredient('Fries',20)
 // ])
 // ];
  constructor( private slService: ShoppingListService){
  }
  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());

  }
  getRecipes(){
    return this.recipes.slice();
  }
  getRecipe(index: number){
    return this.recipes[index];
  }
  addIngredientTosL(ingredients: Ingredient[]){
    this.slService.addIngredients(ingredients);
  }
  addRecipe(recipe:Recipe){
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }
  updateRecipe(index: number, newRecipe: Recipe){
    this.recipes[index] = newRecipe;
    this.recipeChanged.next(this.recipes.slice());
  }
  deleteRecipe(index: number){
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());

  }
}
