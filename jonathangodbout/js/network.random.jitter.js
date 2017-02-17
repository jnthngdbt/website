"use strict";

// SVG.

var svg = d3.select("svg");
var width = svg.attr("width");
var height = svg.attr("height");
var svgsize = width;

// Constants and parameters.

var UpdateIntervalMs = 100

var NumPoints = 16;
var NumEdges = NumPoints*(NumPoints-1)/2;

var VertexSize = 3;

var Pad = 4*VertexSize;
var RandomCoord = d3.randomUniform(Pad, svgsize-Pad/2);

var MaxMotion = 0.6;
var RandomMotion = d3.randomUniform(-MaxMotion, MaxMotion);

var PointColor = d3.rgb(150, 0, 255);
var EdgeColor = d3.rgb(160, 160, 160);

var EdgeWidth = 0.5;

// Build the set of random points.

var points = []
    for (var i = 0; i < NumPoints; i++){
        points.push({
            "x": RandomCoord(), 
            "y": RandomCoord()
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
     .style("stroke-width", EdgeWidth);

    // Enter (display new data).
    l.enter()
        .append("line")
            .attr("x1", function(d){ return d.x1; })
            .attr("x2", function(d){ return d.x2; })
            .attr("y1", function(d){ return d.y1; })
            .attr("y2", function(d){ return d.y2; });
}

var UpdatePoints = function(){
    for (var i = 0; i < NumPoints; i++){
        points[i].x += RandomMotion();
        points[i].y += RandomMotion();
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

