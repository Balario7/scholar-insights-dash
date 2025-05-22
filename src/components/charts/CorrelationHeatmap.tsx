
import React, { useEffect, useRef } from 'react';
import { Student } from '@/types/student';
import { calculateCorrelation } from '@/lib/data';
import * as d3 from 'd3';

interface CorrelationHeatmapProps {
  data: Student[];
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  
  useEffect(() => {
    if (!data.length || !svgRef.current) return;
    
    // Extract scores
    const mathScores = data.map(d => d.mathScore);
    const readingScores = data.map(d => d.readingScore);
    const writingScores = data.map(d => d.writingScore);
    
    // Calculate correlations
    const correlationMatrix = [
      [1, calculateCorrelation(mathScores, readingScores), calculateCorrelation(mathScores, writingScores)],
      [calculateCorrelation(readingScores, mathScores), 1, calculateCorrelation(readingScores, writingScores)],
      [calculateCorrelation(writingScores, mathScores), calculateCorrelation(writingScores, readingScores), 1]
    ];
    
    const subjects = ["Math", "Reading", "Writing"];
    
    // Create the heatmap
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 50, right: 50, bottom: 50, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const cellSize = Math.min(innerWidth, innerHeight) / subjects.length;
    
    // Create color scale
    const colorScale = d3
      .scaleLinear<string>()
      .domain([-1, 0, 1])
      .range(["#3b82f6", "#f5f5f5", "#ef4444"]);
    
    // Create cells for the heatmap
    const cells = svg
      .selectAll("g")
      .data(correlationMatrix)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(0, ${i * cellSize})`);
    
    cells
      .selectAll("rect")
      .data(d => d)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * cellSize)
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("fill", d => colorScale(d))
      .attr("stroke", "#ddd");
    
    // Add correlation values
    cells
      .selectAll("text")
      .data(d => d)
      .enter()
      .append("text")
      .attr("x", (d, i) => i * cellSize + cellSize / 2)
      .attr("y", cellSize / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text(d => d.toFixed(2))
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", d => Math.abs(d) > 0.5 ? "white" : "black");
    
    // Add row labels
    svg
      .selectAll(".row-label")
      .data(subjects)
      .enter()
      .append("text")
      .attr("class", "row-label")
      .attr("x", -10)
      .attr("y", (d, i) => i * cellSize + cellSize / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .style("font-size", "14px")
      .text(d => d);
    
    // Add column labels
    svg
      .selectAll(".col-label")
      .data(subjects)
      .enter()
      .append("text")
      .attr("class", "col-label")
      .attr("x", (d, i) => i * cellSize + cellSize / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text(d => d);
    
    // Add title
    svg
      .append("text")
      .attr("x", innerWidth / 2)
      .attr("y", -30)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Correlation between Subject Scores");
    
    // Add legend
    const legendWidth = 200;
    const legendHeight = 20;
    
    const legendX = innerWidth / 2 - legendWidth / 2;
    const legendY = innerHeight + 30;
    
    const legendScale = d3
      .scaleLinear()
      .domain([-1, 0, 1])
      .range([0, legendWidth / 2, legendWidth]);
    
    const legendAxis = d3
      .axisBottom(legendScale)
      .tickValues([-1, -0.5, 0, 0.5, 1])
      .tickFormat(d3.format(".1f"));
    
    const defs = svg.append("defs");
    
    const linearGradient = defs
      .append("linearGradient")
      .attr("id", "correlation-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");
    
    linearGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", colorScale(-1));
    
    linearGradient
      .append("stop")
      .attr("offset", "50%")
      .attr("stop-color", colorScale(0));
    
    linearGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", colorScale(1));
    
    svg
      .append("rect")
      .attr("x", legendX)
      .attr("y", legendY)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#correlation-gradient)");
    
    svg
      .append("g")
      .attr("transform", `translate(${legendX}, ${legendY + legendHeight})`)
      .call(legendAxis)
      .style("font-size", "12px");
    
    svg
      .append("text")
      .attr("x", legendX + legendWidth / 2)
      .attr("y", legendY + legendHeight + 35)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Correlation Coefficient");
      
  }, [data]);
  
  return (
    <div className="w-full h-full">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default CorrelationHeatmap;
