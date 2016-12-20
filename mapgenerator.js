/*
 * Map generator based on http://buildnewgames.com/astar/
 */

/*
 * Map generator constructor
 * @param opt     set of parameters (width, height and wall frequency)
 */
function MapGenerator(opt) {
  opt = opt || {};

  this.width = opt.width;
  this.height = opt.height;
  this.wallFrequency = opt.wallFrequency;
}

/*
 *  Generates a random map based on parameters given at constructor
 *  @return     a matrix which represents the random map
 */
MapGenerator.prototype.generateMap = function() {
  var world = [];

  for (var x = 0; x < this.width; x++) {
    world[x] = [];
    for (var y = 0; y < this.height; y++) {
      world[x][y] = Math.random() <= this.wallFrequency ? 1 : 0;
    }
  }

  return world;
};

if(module)
  module.exports = MapGenerator;