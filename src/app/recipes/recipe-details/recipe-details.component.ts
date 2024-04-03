import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css'
})
export class RecipeDetailsComponent implements OnInit {
  recipe:Recipe;
  id: number;



  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router){

  }
  ngOnInit(){
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.recipe = this.recipeService.getRecipe(this.id);
      }
      
    );
    
  }

  onAddToShopping(){
    this.recipeService.addIngredientTosL(this.recipe.ingredients);

  }
  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.route});

  }
  onDelete(){
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }

}
