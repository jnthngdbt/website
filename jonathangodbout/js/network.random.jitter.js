"use strict";

// SVG.

var svg = d3.select("svg");
var width = svg.attr("width");
var height = svg.attr("height");

// Constants and parameters.

var UpdateIntervalMs = 100

var NumPoints = 32;
var NumEdges = NumPoints*(NumPoints-1)/2;

var VertexSize = 3;

var Pad = 1*VertexSize;
var RandomCoordX = d3.randomUniform(Pad, width-Pad);
var RandomCoordY = d3.randomUniform(Pad, height-Pad);

var MaxMotion = 0.6;
var RandomMotion = d3.randomUniform(-MaxMotion, MaxMotion);

var PointColor = d3.rgb(150, 0, 255);
var EdgeColor = d3.rgb(160, 160, 160);

var EdgeWidth = 0.5;
var EdgeOpacity = 0.4;

// Build the set of random points.

var points = []
    for (var i = 0; i < NumPoints; i++){
        points.push({
            "x": RandomCoordX(), 
            "y": RandomCoordY()
        });
    }

// Build the set of edges connecting those points.
// For N points, there are N.(N-1)/2 edges.

var edges = []
for (var i = 0; i < NumPoints; i++){
    for (var j = i+1; j < NumPoints; j++){
        edges.push({
            "x1": points[i].x, 
            "x2": points[j].x,
            "y1": points[i].y,
            "y2": points[j].y
        });              
    }
}  

var DisplayPoints = function(pts){
    // Bind data.
    var c = svg.selectAll("circle")
        .data(pts)

    // Exit (remove unused data).
    c.exit().remove();

    // Update already bound data.
    c.attr("cx", function(d){ return d.x; })
     .attr("cy", function(d){ return d.y; })
     .attr("r", VertexSize)
     .attr("fill", PointColor);

    // Enter (display new data).
    c.enter()
        .append("circle")
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
            .attr("r", VertexSize)
            .attr("fill", PointColor);
}

var DisplayEdges = function(edges){
    // Bind data.
    var l = svg.selectAll("line")
        .data(edges)

    // Exit (remove unused data).
    l.exit().remove();

    // Update already bound data.
    l.attr("x1", function(d){ return d.x1; })
     .attr("x2", function(d){ return d.x2; })
     .attr("y1", function(d){ return d.y1; })
     .attr("y2", function(d){ return d.y2; })
     .style("stroke", EdgeColor)
     .style("stroke-width", EdgeWidth)
     .style("stroke-opacity", EdgeOpacity);

    // Enter (display new data).
    l.enter()
        .append("line")
            .attr("x1", function(d){ return d.x1; })
            .attr("x2", function(d){ return d.x2; })
            .attr("y1", function(d){ return d.y1; })
            .attr("y2", function(d){ return d.y2; })
            .style("stroke", EdgeColor)
            .style("stroke-width", EdgeWidth)
            .style("stroke-opacity", EdgeOpacity);

}

var UpdatePoints = function(){
    for (var i = 0; i < NumPoints; i++){
        var NewX = points[i].x + RandomMotion();
        var NewY = points[i].y + RandomMotion();

        // Avoid letting them get out of svg.
        points[i].x = Math.min(Math.max(Pad, NewX), width-Pad);
        points[i].y = Math.min(Math.max(Pad, NewY), height-Pad);
    }        
}

var UpdateEdges = function(){
    var k = 0;
    for (var i = 0; i < NumPoints; i++){
        for (var j = i+1; j < NumPoints; j++){
            edges[k].x1 = points[i].x;
            edges[k].x2 = points[j].x;
            edges[k].y1 = points[i].y;
            edges[k].y2 = points[j].y;
            k++;              
        }
    }    
}

var UpdateNetwork = function(){
    // Set points before edges connecting them.
    UpdatePoints();
    UpdateEdges();

    // Display edges first, so points are on top.
    DisplayEdges(edges);
    DisplayPoints(points);
}

d3.interval(UpdateNetwork, UpdateIntervalMs)

