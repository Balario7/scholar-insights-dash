
import React, { useEffect, useRef } from 'react';
import { Student } from '@/types/student';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as d3 from 'd3';

interface BoxPlotProps {
  data: Student[];
}

const BoxPlot: React.FC<BoxPlotProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  
  useEffect(() => {
    if (!data.length || !svgRef.current) return;
    
    const educationLevels = [
      'some high school',
      'high school', 
      'some college', 
      'associate\'s degree', 
      'bachelor\'s degree', 
      'master\'s degree'
    ];
    
    const subjects = ['mathScore', 'readingScore', 'writingScore'];
    const subjectColors = ['#3b82f6', '#10b981', '#8b5cf6'];
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 20, right: 30, bottom: 80, left: 60 };
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
      
    // Group data by education level
    const dataByEducation: Record<string, Record<string, number[]>> = {};
    
    educationLevels.forEach(level => {
      dataByEducation[level] = {
        'mathScore': [],
        'readingScore': [],
        'writingScore': []
      };
    });
    
    data.forEach(student => {
      if (dataByEducation[student.parentalEducation]) {
        subjects.forEach(subject => {
          dataByEducation[student.parentalEducation][subject].push(student[subject as keyof Student] as number);
        });
      }
    });
    
    // Calculate box plot statistics for each group
    const boxPlotData: any[] = [];
    
    educationLevels.forEach((level, eduIndex) => {
      subjects.forEach((subject, subjectIndex) => {
        const scores = dataByEducation[level][subject];
        if (scores.length) {
          scores.sort((a, b) => a - b);
          
          const q1 = d3.quantile(scores, 0.25) || 0;
          const median = d3.quantile(scores, 0.5) || 0;
          const q3 = d3.quantile(scores, 0.75) || 0;
          const iqr = q3 - q1;
          const min = Math.max(0, d3.min(scores) || 0);
          const max = Math.min(100, d3.max(scores) || 100);
          
          boxPlotData.push({
            education: level,
            subject,
            q1,
            median,
            q3,
            min,
            max,
            color: subjectColors[subjectIndex],
            x: eduIndex * (3 * 40) + subjectIndex * 40,
          });
        }
      });
    });
    
    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(educationLevels)
      .range([0, innerWidth])
      .padding(0.1);
      
    const yScale = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);
    
    // Add X and Y axes
    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .style("font-size", "12px");
      
    svg
      .append("g")
      .call(d3.axisLeft(yScale))
      .style("font-size", "12px");
      
    // Y axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Score");
      
    // Draw box plots
    const boxWidth = 20;
    
    boxPlotData.forEach((d) => {
      const g = svg.append("g").attr("transform", `translate(${xScale(d.education)! + 40},0)`);
      
      // Vertical line from min to max
      g.append("line")
        .attr("x1", d.x)
        .attr("x2", d.x)
        .attr("y1", yScale(d.min))
        .attr("y2", yScale(d.max))
        .attr("stroke", "black")
        .attr("stroke-width", 1);
        
      // Box from Q1 to Q3
      g.append("rect")
        .attr("x", d.x - boxWidth / 2)
        .attr("y", yScale(d.q3))
        .attr("width", boxWidth)
        .attr("height", yScale(d.q1) - yScale(d.q3))
        .attr("stroke", "black")
        .attr("fill", d.color)
        .attr("fill-opacity", 0.7);
        
      // Median line
      g.append("line")
        .attr("x1", d.x - boxWidth / 2)
        .attr("x2", d.x + boxWidth / 2)
        .attr("y1", yScale(d.median))
        .attr("y2", yScale(d.median))
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    });
    
    // Add a legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${innerWidth - 150}, ${innerHeight + 40})`);
      
    subjects.forEach((subject, i) => {
      legend
        .append("rect")
        .attr("x", 0)
        .attr("y", i * 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", subjectColors[i]);
        
      legend
        .append("text")
        .attr("x", 20)
        .attr("y", i * 20 + 12)
        .text(subject.replace("Score", ""))
        .style("font-size", "12px");
    });
    
  }, [data]);
  
  return (
    <div className="w-full h-full">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default BoxPlot;
