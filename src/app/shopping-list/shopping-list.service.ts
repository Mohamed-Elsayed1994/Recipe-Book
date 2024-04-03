
import { Ingredient } from "../shared/ingredients.model";
import { Subject } from "rxjs";

export class ShoppingListService {
  startedEditing= new Subject<number>();
  ingredientChange= new Subject<Ingredient[]>();
  private ingredients: Ingredient[] =[
    new Ingredient('APPLE', 5),
    new Ingredient('TOMATO', 10)
  ];

  constructor() { } 

  getIngredients(){
    return this.ingredients.slice();
  }  
  
  getIngredient(index: number){
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient){
    this.ingredients.push(ingredient);
    this.ingredientChange.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]){
    this.ingredients.push(...ingredients);
    this.ingredientChange.next(this.ingredients.slice());
  }
  
  updateIngredient(index: number , newIngredient: Ingredient){
    this.ingredients[index]= newIngredient;
    this.ingredientChange.next(this.ingredients.slice());
  }

  deleteIndredient(index: number){
    this.ingredients.splice(index, 1);
    this.ingredientChange.next(this.ingredients.slice());
  }

}
