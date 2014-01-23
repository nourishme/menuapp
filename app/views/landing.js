<div class="searchBox">

  <p> What ingredient would you like to cook with today?</p>
  <form>
    <input type="search" ng-model="ingredientSearch" placeholder="Ingredient"></input>
  </form>

  <div class="matchingIngredients" ng-show="ingredientSearch">
    <!-- <h3 class="topcoat-list__header">Search Results</h3> -->
     <ul class="topcoat-list__container">
      <li class="topcoat-list__item" ng-repeat="ingredient in ingredients | filter:ingredientSearch" ng-click="addToCook(ingredient)" >
          <span>{{ingredient.name}}</span>
      </li>
    </ul>
  </div>

<div>

  
<!-- 
  <div class="suggestedIngredients" ng-show="false">
    <h3 class="topcoat-list__header">Suggested Ingredients</h3>
    <ul class="topcoat-list__container">
      <li class="topcoat-list__item" ng-repeat="ingredient in suggestedIngredients"  ng-click="addToCook(ingredient)">
          <span>{{ingredient.name}}</span>
      </li>
    </ul>
  </div>

  <div class="toCook" ng-show="showCook">
    <h3 class="topcoat-list__header">What we're cooking with today</h3>
    <ul class="topcoat-list__container">
      <li class="topcoat-list__item" ng-repeat="ingredient in toCook" ng-click="removeFromToCook(ingredient)">
          <span >{{ingredient.name}}</span>
      </li>
    </ul>
  </div>

  <a href="#/searchResults/" ng-show="showCook"><button>Get Recipes</button></a>
 -->