/**
 * SpecHelper provides support for lib.spec.PlayerSpec Jasmine Test Spec
 * 
 * @class spec.SpecHelper
 */
beforeEach(function() {
  this.addMatchers({
    toBePlaying: function(expectedSong) {
      var player = this.actual;
      return player.currentlyPlayingSong === expectedSong && player.isPlaying;
    }
  });
});
