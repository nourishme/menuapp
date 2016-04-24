
var ingredients = require('../datainit/ingredientlist.json');
var api = require('../routes/apiRoutes.js');

module.init = function (){


    // for each element in ingredients[]
    return Rx.Observable.fromArray(ingredients)
      // Put the ingredient in the graph
      .flatMap(PutIngredient)
      .subscribe(onNext, onError, onComplete);

    function PutIngredient(ingredient){
      var dbInsertNodePath = '/db/data/node';
      return Rx.Observable.just(dbInsertNodePath)
        .flatMap(api.PostWithData(ingredient))
        .pluck('body')
    }

    function onNext(node_location) {
      console.log('ingredient inserted at: ', node_location);
    }

    function onError(err) {
      // it'll all be okay
      console.log('you\'re dumb, :`( ', err.stack);
    }

    function onComplete() {
      console.log('Completed Ingredients Insert')
    }


}
