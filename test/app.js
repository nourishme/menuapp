
// angular.module('myApplicationModule', [])
//     .value('mode', 'app')
//     .value('version', 'v1.0.1');

describe('MyApp', function() {
 
  // You need to load modules that you want to test,
  // it loads only the "ng" module by default.
  beforeEach(module('app'));
 
 
  // inject() is used to inject arguments of all given functions
  it('should provide a version', inject(function(mode, version) {
    expect(version).toEqual('v1.0.1');
    expect(mode).toEqual('app');
  }));
 
 
  // The inject and module method can also be used inside of the it or beforeEach
  it('should override a version and test the new version is injected', function() {
    // module() takes functions or strings (module aliases)
    module(function($provide) {
      $provide.value('version', 'overridden'); // override version here
    });
 
    inject(function(version) {
      expect(version).toEqual('overridden');
    });
  });
});