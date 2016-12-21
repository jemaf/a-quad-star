var AQS = require('./AQuickStar'),
    MG = require('./MapGenerator'),
    PF = require('pathfinding'), 
    fs = require('fs'),
   csvWriter = require('csv-write-stream');

require('console-stamp')(console, 'HH:MM:ss.l');

var repeat = 100;
var frequency = [0, 0.1, 0.2, 0.3, 0.4];
var mapSize = [8, 16, 32, 64, 128];
var fileName = "results/output.csv";

var testData = [["Map", "Wall", "A*", "AQS", "Compress"]];

mapSize.forEach(function(mapValue) {
    var w = mapValue, h = mapValue;
    var start = [0, 0], end = [w - 1, h - 1]; 

    frequency.forEach(function(frequencyValue) {
        var aStarLengthAvg = 0;
        var aqsLengthAvg = 0;
        var compressRateAvg = 0;
        var values = [];

        console.log("Processando configuração: tamanho=" + mapValue + "; muros=" + frequencyValue);

        for(var i = 0; i < repeat; i++) {

            // generates random map
            var optMG = {width: w, height: h, wallFrequency: frequencyValue};
            var generator = new MG(optMG);
            var map = generator.generateMap();

            map[start[0]][start[1]] = 0;
            map[end[0]][end[1]] = 0;

            var optAQS = { map: map, width: w, height: h };
            var aqs = new AQS(optAQS);

            var grid = new PF.Grid(map);    
            var finder = new PF.AStarFinder();
            var aStarPath = finder.findPath(0, 0, w-1, h-1, grid);
            var aqsPath = aqs.findPath(start, end);
            
            if(aStarPath.length == 0) {
                i--;
            } else {
                aStarLengthAvg += aStarPath.length;
                aqsLengthAvg += aqsPath.length;
                compressRateAvg += 1 - (aqs.getNumberOfWalkBlocks() / (w * h - aqs.getNumberOfWallBlocks()));

                values.push([aStarPath.length, aqsPath.length, 1 - (aqs.getNumberOfWalkBlocks() / (w * h - aqs.getNumberOfWallBlocks()))]);
            }
        }

        var writer = csvWriter({ headers: ["A*", "AQS", "Compress rate"]});
        var currentName = "results/" + mapValue + "_" + frequencyValue + ".csv";
        writer.pipe(fs.createWriteStream(currentName));
        for(var i = 1; i < values.length; i++) {
            writer.write(values[i]);
        }
        writer.end();

        aStarLengthAvg /= repeat;
        aqsLengthAvg /= repeat;
        compressRateAvg /= repeat;

        testData.push([mapValue, frequencyValue, aStarLengthAvg, aqsLengthAvg, compressRateAvg]);
    });
});


var writer = csvWriter({ headers: testData[0]});
writer.pipe(fs.createWriteStream(fileName));
for(var i = 1; i < testData.length; i++) {
    writer.write(testData[i]);
}
writer.end();
console.log("Arquivo salvo com sucesso!!");