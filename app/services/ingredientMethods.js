app.service('ingredientMethods', function () {
  
  var toCook = {};

  return {
    getToCook: function () {
      return toCook;
    },
    setToCook: function(value) {
      toCook = value;
      return toCook;
    }
  };
});