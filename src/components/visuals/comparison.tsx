// @ts-nocheck
'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3-v4';
import {VoteData} from '@/types/propdata';
import { SelectedPropContext } from '@/context/SelectedPropContext';
import { ComparePropContext } from '@/context/ComparePropContext';


type MapProps = {
  prop1VoteData?: VoteData[];
  prop2VoteData?: VoteData[];

}

type CountyProperties = {
  name: string;
  [key: string]: any;
}

export function ComparisonVisual({prop1VoteData, prop2VoteData}: MapProps) {
  const SelectedProp1 = useContext(SelectedPropContext)
  const propositionName1  = SelectedProp1 ?SelectedProp1.name : '';
  const SelectedProp2 = useContext(ComparePropContext)
  const propositionName2  = SelectedProp2 ?SelectedProp2.name : '';
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<d3.Selection<HTMLDivElement, unknown, HTMLElement, any>>();
  const [chartSize, setChartSize] = useState({ width: 800, height: 480 });

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const measure = () => {
      const next = {
        width: Math.floor(node.clientWidth),
        height: Math.floor(node.clientHeight),
      };
      setChartSize((current) => (
        next.width < 1 || next.height < 1 || (current.width === next.width && current.height === next.height)
          ? current
          : next
      ));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    var voteData = null;
    
    if (prop2VoteData.length > 0) {
      voteData = structuredClone(prop2VoteData);
    }
    else {
      voteData = structuredClone(prop1VoteData);
    }

    if (!svgRef.current || !containerRef.current) return;
      // Clear all existing elements from the SVG
    d3.select(svgRef.current).selectAll("*").remove();

        // Create tooltip
        const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background-color', 'white')
        .style('padding', '10px')
        .style('border', '1px solid #ddd')
        .style('border-radius', '4px')
        .style('pointer-events', 'none')
        .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
        .style('color', '#374151') 
        .style('font-size', '14px');
  
      tooltipRef.current = tooltip;

    const label1 = shortMeasureName(propositionName1);
    const label2 = shortMeasureName(propositionName2);
    const legend = [
      label1 ? { label: label1, color: '#998ec3' } : null,
      label2 ? { label: label2, color: '#f1a340' } : null,
    ].filter(Boolean);
    const legendHeight = Math.max(legend.length, 1) * 20;

    // Set the dimensions and margins of the graph
    const margin = { top: legendHeight + 16, right: 16, bottom: 78, left: 72 },
      width = Math.max(220, (chartSize.width || 800) - margin.left - margin.right),
      height = Math.max(180, (chartSize.height || 480) - margin.top - margin.bottom);

    const root = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const legendGroup = root.append('g').attr('transform', 'translate(' + margin.left + ',12)');
    if (legend.length === 0) {
      legendGroup.append('text')
        .attr('y', 14)
        .attr('font-size', 14)
        .attr('fill', '#333')
        .text('Select two measures');
    }
    legend.forEach((item, index) => {
      const y = index * 20;
      legendGroup.append('rect')
        .attr('x', 0)
        .attr('y', y)
        .attr('width', 12)
        .attr('height', 12)
        .attr('rx', 2)
        .attr('fill', item.color)
        .attr('stroke', '#333');
      legendGroup.append('text')
        .attr('x', 18)
        .attr('y', y + 11)
        .attr('font-size', 13)
        .attr('font-weight', '600')
        .attr('fill', '#333')
        .text(fitText(item.label, width - 18, 13));
    });

    const svg = root
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      


    

  //d3.select(svgRef.current).call(zoom);
    // Extract the county names and voter data
    const counties = voteData.map((d) => d.county_name);



    // Define scales
    var x = d3
    .scaleBand()
    .domain(counties) // Map counties to bands
    .range([0, width * 2]) // Map bands to chart width
    .paddingInner(0.65) // Space within bands
    .paddingOuter(0.2); // Space on the outer edges


    const y = d3
      .scaleLinear()
      .domain([0, 100])
      .nice()
      .range([height, 0]);


    // Create a clipPath
    const clip = svg
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', width)
      .attr('height', height + 100)
      .attr('x', 0)
      .attr('y', 0);

    // Create the scatter group
    const scatter = svg
      .append('g')
      .attr('clip-path', 'url(#clip)');


      // Add an initial label "Counties"
  const xAxisLabel = svg
  .append('text')
  .attr('class', 'x-axis-label')
  .attr('x', width / 2)
      .attr('y', height + 18)
  .attr('text-anchor', 'middle')
  .style('font-size', '13px')
  .style('font-weight', '600')
  .text('Counties');

  // Append X-axis
  svg
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(d3.axisBottom(x).tickSizeInner(6))
    .selectAll('text')
    .attr('dx', '-0.4em')
    .attr('dy', '0.2em')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end')
    .style('font-size', '11px')
    .style('font-weight', '600')
    .style('opacity', '0');

      // Adjust tick positions
  svg
  .selectAll('.x-axis .tick')
  .attr('transform', function (d) {
    // Move tick to center of bar
    return 'translate(' + (x(d) + x.bandwidth()) + ',0)';
  });


    // Add the Y-axis label
const yAxisLabel = svg
.append('text')
.attr('class', 'y-axis-label')
.attr('x', -height / 2)
.attr('y', -56)
.attr('transform', 'rotate(-90)')
.attr('text-anchor', 'middle')
.style('font-size', '12px')
.style('font-weight', '600')
.text('Yes share');

    // Append Y-axis
    const yAxis = svg.append('g').call(d3.axisLeft(y));


      const barSpacing = 2; // Space between bars in the same county
      // Draw bars
  // Draw bars
  if (prop1VoteData.length > 0) {
  scatter
    .append('g')
    .attr('class', 'bars')
    .selectAll('rect')
    .data(prop1VoteData)
    .enter()
    .append('rect')
    .attr('x', (d) => x(d.county_name))
    .attr('y', (d) => {
      return(y((d.yes_count)/(d.yes_count+d.no_count)*100));
    })
    .attr('width', x.bandwidth())
    .attr('height', (d) => height - (y((d.yes_count)/(d.yes_count+d.no_count)*100)))
    .attr('fill', '#998ec3') // purple for "prop 1"
    .style('stroke', '#000000')
    .on('mouseenter', function (d) {
      const mouseX = d3.mouse(document.body)[0];
      const mouseY = d3.mouse(document.body)[1];
      d3.select(this).style('opacity', 0.7); // Highlight the bar
      const countyName = d.county_name;
      const yesVotes = d.yes_count;
      const noVotes = d.no_count;
      tooltip
        .style('opacity', 1)
        .html(
          `<div class="font-medium text-gray-900 mb-1">${countyName} County</div>
           <div class="text-gray-700">
           Votes For: ${yesVotes.toLocaleString()}<br/>
           Votes Against: ${noVotes.toLocaleString()}<br/>
           Total Votes: ${(yesVotes + noVotes).toLocaleString()}</div>`
        )
        .style('left', mouseX + 10 + 'px')
        .style('top', mouseY - 20 + 'px');
    })
    .on('mousemove', function () {
      const mouseX = d3.mouse(document.body)[0];
      const mouseY = d3.mouse(document.body)[1];
      tooltip
        .style('left', mouseX + 10 + 'px')
        .style('top', mouseY - 20 + 'px');
    })
    .on('mouseleave', function () {
      d3.select(this).style('opacity', 1); // Reset opacity
      tooltip.style('opacity', 0); // Hide tooltip
    });
  }

  if (prop2VoteData.length > 0)  {
  scatter
    .append('g')
    .attr('class', 'bars2')
    .selectAll('rect')
    .data(prop2VoteData)
    .enter()
    .append('rect')
    .attr('x', (d) => x(d.county_name) + x.bandwidth() * 1.3)
    .attr('y', (d) => (y((d.yes_count)/(d.yes_count+d.no_count)*100)))
    .attr('width', x.bandwidth())
    .attr('height', (d) => height - (y((d.yes_count)/(d.yes_count+d.no_count)*100)))
    .attr('fill', '#f1a340') // orange for prop 2
    .style('stroke', '#000000')
    .on('mouseenter', function (d) {
      const mouseX = d3.mouse(document.body)[0];
      const mouseY = d3.mouse(document.body)[1];
      d3.select(this).style('opacity', 0.7); // Highlight the bar
      const countyName = d.county_name;
      const yesVotes = d.yes_count;
      const noVotes = d.no_count;
      tooltip
        .style('opacity', 1)
        .html(
          `<div class="font-medium text-gray-900 mb-1">${countyName} County</div>
           <div class="text-gray-700">
           Votes For: ${yesVotes.toLocaleString()}<br/>
           Votes Against: ${noVotes.toLocaleString()}<br/>
           Total Votes: ${(yesVotes + noVotes).toLocaleString()}</div>`
        )
        .style('left', mouseX + 10 + 'px')
        .style('top', mouseY - 20 + 'px');
    })
    .on('mousemove', function () {
      const mouseX = d3.mouse(document.body)[0];
      const mouseY = d3.mouse(document.body)[1];
      tooltip
        .style('left', mouseX + 10 + 'px')
        .style('top', mouseY - 20 + 'px');
    })
    .on('mouseleave', function () {
      d3.select(this).style('opacity', 1); // Reset opacity
      tooltip.style('opacity', 0); // Hide tooltip
    });
  }

  // Set zoom and pan features
  const zoom = d3
    .zoom()
    .scaleExtent([1, 30]) // Limit zoom range: 1 means no zooming out smaller than the SVG
    .extent([
      [0, 0],
      [width, height],
    ])
    .translateExtent([
      [0, 0],
      [width, height],
    ]) // Limit panning
    .on('zoom', updateChart);

    d3.select(svgRef.current).call(zoom);

    /*
    // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
    svg
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .attr(
      'transform',
      'translate(' + margin.left + ',' + margin.top + ')',
    )
    .call(zoom);
    */


    var xLinear = d3
    .scaleLinear()
    .domain([0, counties.length])
    .range([0, width]);


      function updateChart() {
        // Recover the new scale from zoom event
        var t = d3.event.transform;
    
        // Limit side-to-side movement to keep the graph in bounds
        t.x = Math.min(0, Math.max(t.x, -width * (t.k - 1)));
        t.y = 0;
    
        var newX = t.rescaleX(xLinear);
    
        // Determine visible counties
        var visibleCounties = counties.filter((county, i) => {
          const xPos = newX(i);
          return xPos >= 0 && xPos <= width; // Check if county is within visible frame
        });
    
        // Calculate new Y domain based on visible counties
        const visibleMax = d3.max(visibleCounties, (county) => {
          const countyData = voteData.find(
            (d) => d.county_name === county,
          );
          return countyData
            ? (100)
            : 0;
        });
    
        //fade into visibility of x axis
      
        const showNames = t.k > 2.1;
        xAxisLabel
          .transition()
          .duration(100)
          .style('opacity', showNames ? 0 : 1);
        svg
          .selectAll('.x-axis text')
          .transition()
          .duration(100)
          .style('opacity', (county) => {
            if (!showNames) return 0;
            const index = counties.indexOf(county);
            const xPos = newX(index);
            const step = Math.abs(newX(index + 1) - xPos);
            if (xPos < 12 || xPos > width - 8 || step < 28) return 0;
            return 1;
          });
    
        // Update the Y scale domain dynamically to fit visible bars
        var newY = y.copy().domain([0, visibleMax || 1]);
    
        // Animate Y-axis transition
        yAxis
          .transition()
          .duration(500)
          .ease(d3.easeCubicOut)
          .call(d3.axisLeft(newY));
    
        // Compute the bar width with a maximum cap
        const barWidth = Math.min(newX(1) - newX(0), 40); // Cap bar width to 30px
    
        // Update bar positions and heights with animation
        svg
          .selectAll('.bars rect')
          .transition()
          .duration(500)
          .ease(d3.easeCubicOut)
          .attr('x', (d) => {
            //console.log('data: ' + d.data.county_name);
            return(newX(counties.indexOf(d.county_name)))}
          )
          .attr('width', barWidth) // Use the computed bar width
          .attr('y', (d) => {
            //console.log('Data value (d[1]):', d[1]);
            //console.log(
            //  'Mapped pixel value (newY(d[1])):',
            //  newY(d[1]),
           // );
            return (newY((d.yes_count)/(d.yes_count+d.no_count)*100));
          })
          .attr('height', (d) => height - (newY((d.yes_count)/(d.yes_count+d.no_count)*100)));
          

          svg
          .selectAll('.bars2 rect')
          .transition()
          .duration(500)
          .ease(d3.easeCubicOut)
          .attr('x', (d) => {
            //console.log('data: ' + d.data.county_name);
            return(newX(counties.indexOf(d.county_name))+ barWidth*1.3)}
          )
          .attr('width', barWidth) // Use the computed bar width
          .attr('y', (d) => {
            //console.log('Data value (d[1]):', d[1]);
            //console.log(
            //  'Mapped pixel value (newY(d[1])):',
            //  newY(d[1]),
           // );
            return (newY((d.yes_count)/(d.yes_count+d.no_count)*100));
          })
          .attr('height', (d) => height - (newY((d.yes_count)/(d.yes_count+d.no_count)*100)));
        // Move ticks along the X-axis
        svg
          .selectAll('.x-axis .tick')
          .transition()
          .duration(500)
          .ease(d3.easeCubicOut)
          .attr(
            'transform',
            (d) =>
              'translate(' +
              (newX(counties.indexOf(d)) + barWidth * 1.15) +
              ',0)',
          );
      }

      return () => {
        if (tooltipRef.current) {
          tooltipRef.current.remove();
        }
      };
  }, [prop1VoteData, prop2VoteData, chartSize, propositionName1, propositionName2]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}

function shortMeasureName(name) {
  if (!name) return '';
  return name.split(' - ')[0].replace(/\s*\([^)]*\)\s*$/, '').trim();
}

function fitText(text, maxWidth, fontSize) {
  const maxChars = Math.max(4, Math.floor(maxWidth / (fontSize * 0.56)));
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars - 1) + '…';
}
