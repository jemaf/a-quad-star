var QuadTree = require('./Quadtree');


function AQuickStar(opt) {
	opt = opt || {};

	this.map = opt.map;
	this.width = opt.width;
	this.height = opt.height;
	
	this.qt = new QuadTree({
    	x: 0,
    	y: 0,
    	width: this.width,
    	height: this.height
	}, 1, Number.MAX_VALUE);

	// map initial state
	for (var i = 0; i < this.width; i++)
		for (var j = 0; j < this.height; j++)
			if (this.map[i][j] == 1)
				this.qt.insert({x: i, y: j, width: 1, height: 1});


}


AQuickStar.prototype.addObstacle = function(x, y) {
	this.map[x][y] = 1;
	this.qt.insert({x: y, y: x, width: 1, height: 1});
};


AQuickStar.prototype.removeObstacle = function(x, y) {
	this.map[x][y] = 0;
	this.qt.remove({x: y, y: x, width: 1, height: 1});
};


AQuickStar.prototype._getNeighbors = function(bounds) {
	var result = [];
	var neighbors = [];

	// generate all top and bottom neighbors coordinates
	for (var wi = bounds.x; wi <  bounds.x + bounds.width; wi++) {
		neighbors.push({ x: wi, y: bounds.y - 1, width: 1, height: 1 });
		neighbors.push({ x: wi, y: bounds.y + bounds.height, width: 1, height: 1 });
	}

	// generate all left and right neighbors coordinates
	for (var hi = bounds.y; hi < bounds.y + bounds.width; hi++) {
		neighbors.push({ x: bounds.x - 1, y: hi, width: 1, height: 1 });
		neighbors.push({ x: bounds.x + bounds.width, y: hi, width: 1, height: 1 });
	}

	for (var i = 0; i < neighbors.length; i++) {
		var neighbor = neighbors[i];
		
		// check if neighbor is still inside the map
		if (!(0 <= neighbor.x && neighbor.x < this.width && 0 <= neighbor.y && neighbor.y < this.height))
			continue;
		
		// check if the neighbor is actually a block
		if (this.map[neighbor.x][neighbor.y] == 1)
			continue;

		// get neighbor's information from quadtree and put it into the result array 
		result.push(this._getNeighbor(neighbor));
	}

	// eliminates duplicated elements
	result = result.filter((e1, index, self) => 
									self.findIndex((e2) => 
											{return e2.y === e1.y && e2.x === e1.x && e2.value === e1.value; }) === index);


	return result;
};


AQuickStar.prototype._getNeighbor = function(node) {

	var retrievedNeighbor = this.qt.getObjectNode(node);

	// if the node is on the lowest level or it is inside a quadrant with only one block,
	// then return it with one value
	if (retrievedNeighbor.level == Math.log2(this.width) || 
		(retrievedNeighbor.level < Math.log2(this.width) && retrievedNeighbor.objects.length)) {
		return {
			x: node.x,
			y: node.y,
			value: 1
		};
	}

	// Return the group nodes otherwise
	return {
		x: retrievedNeighbor.bounds.x,
		y: retrievedNeighbor.bounds.y,
		value: Math.sqrt(Math.pow(retrievedNeighbor.bounds.width, 2) + Math.pow(retrievedNeighbor.bounds.height, 2))
	};
};


AQuickStar.prototype.findPath = function(start, end) {
	console.log("FIND PATH");
};

module.exports = AQuickStar;