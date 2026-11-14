'use client';

import React, { useContext, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SelectedPropContext } from '@/context/SelectedPropContext';
import { NO_MID, NO_STRONG, PASS_LINE, YES_MID, YES_STRONG } from '@/lib/colors';

type Row = {
  name: string;
  share: number;
  yes: number;
  no: number;
  cast: number;
};

export function CountyMarginChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const selected = useContext(SelectedPropContext);
  const votes = selected?.votes ?? [];
  const passPercentage = selected?.passed_percentage ?? 50;

  useEffect(() => {
    const container = containerRef.current;
    const svgNode = svgRef.current;
    if (!container || !svgNode) return;

    const tooltip = d3.select(document.body)
      .append('div')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('padding', '10px')
      .style('border', '1px solid #ddd')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
      .style('color', '#374151')
      .style('font-size', '14px')
      .style('z-index', '50');

    const color = d3.scaleLinear<string>()
      .domain([
        0,
        passPercentage / 2,
        passPercentage,
        passPercentage + (100 - passPercentage) / 2,
        100,
      ])
      .range([NO_STRONG, NO_MID, PASS_LINE, YES_MID, YES_STRONG])
      .clamp(true);

    const rows: Row[] = votes
      .map((vote) => {
        const yes = vote.yes_count || 0;
        const no = vote.no_count || 0;
        const cast = yes + no;
        return {
          name: vote.county_name,
          share: cast === 0 ? 0 : (yes / cast) * 100,
          yes,
          no,
          cast,
        };
      })
      .filter((row) => row.cast > 0)
      .sort((a, b) => a.share - b.share || a.name.localeCompare(b.name));

    function render() {
      const width = container?.clientWidth || 640;
      const margin = {
        top: 46,
        right: 52,
        bottom: 8,
        left: width < 480 ? 96 : 118,
      };
      const rowHeight = 16;
      const height = margin.top + margin.bottom + Math.max(rows.length, 1) * rowHeight;

      const svg = d3.select(svgNode)
        .attr('width', width)
        .attr('height', height);
      svg.selectAll('*').remove();

      svg.append('text')
        .attr('x', 4)
        .attr('y', 16)
        .attr('font-size', 13)
        .attr('font-weight', 'bold')
        .attr('fill', '#333')
        .text(rows.length === 0 ? 'Select a proposition' : 'Yes share ranking');

      if (rows.length === 0) return;

      const x = d3.scaleLinear().domain([0, 100]).range([margin.left, width - margin.right]);
      const y = d3.scaleBand<string>()
        .domain(rows.map((row) => row.name))
        .range([margin.top, height - margin.bottom])
        .padding(0.22);

      svg.append('g')
        .attr('transform', `translate(0, ${margin.top})`)
        .call(d3.axisTop(x).tickValues([0, passPercentage, 100]).tickFormat((value) => `${value}%`))
        .call((axis) => axis.select('.domain').attr('stroke', '#a8a29e'))
        .call((axis) => axis.selectAll('text').attr('fill', '#333').attr('font-size', 11));

      const passX = x(passPercentage);
      svg.append('line')
        .attr('x1', passX)
        .attr('x2', passX)
        .attr('y1', margin.top)
        .attr('y2', height - margin.bottom)
        .attr('stroke', '#111')
        .attr('stroke-width', 1.25)
        .attr('stroke-dasharray', '3 3');

      const bars = svg.append('g')
        .selectAll('rect')
        .data(rows)
        .enter()
        .append('rect')
        .attr('x', x(0))
        .attr('y', (row) => y(row.name) ?? 0)
        .attr('width', (row) => Math.max(0, x(row.share) - x(0)))
        .attr('height', y.bandwidth())
        .attr('fill', (row) => color(row.share))
        .attr('rx', 2)
        .style('cursor', 'pointer');

      svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).tickSize(0))
        .call((axis) => axis.select('.domain').remove())
        .call((axis) => axis.selectAll('text').attr('fill', '#333').attr('font-size', width < 480 ? 10 : 11));

      svg.append('g')
        .selectAll('text')
        .data(rows)
        .enter()
        .append('text')
        .attr('x', (row) => x(row.share) + 4)
        .attr('y', (row) => (y(row.name) ?? 0) + y.bandwidth() / 2)
        .attr('dominant-baseline', 'middle')
        .attr('font-size', 10)
        .attr('fill', '#333')
        .text((row) => `${row.share.toFixed(0)}%`);

      function showTooltip(event: MouseEvent, row: Row) {
        const passed = row.share > passPercentage;
        tooltip
          .style('opacity', 1)
          .html(`
            <div style="font-weight:600;margin-bottom:4px">${row.name} County</div>
            <div>
              ${row.share.toFixed(1)}% yes · ${passed ? 'Passed' : 'Did not pass'}<br/>
              Votes cast: ${row.cast.toLocaleString()}<br/>
              Votes For: ${row.yes.toLocaleString()}<br/>
              Votes Against: ${row.no.toLocaleString()}
            </div>
          `)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      }

      bars
        .on('mouseenter', function (event, row) {
          d3.select(this).attr('stroke', '#111').attr('stroke-width', 1);
          showTooltip(event, row);
        })
        .on('mousemove', function (event, row) {
          showTooltip(event, row);
        })
        .on('mouseleave', function () {
          d3.select(this).attr('stroke', 'none');
          tooltip.style('opacity', 0);
        });
    }

    render();
    const observer = new ResizeObserver(render);
    observer.observe(container);

    return () => {
      observer.disconnect();
      tooltip.remove();
    };
  }, [votes, passPercentage]);

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} className="block w-full" />
    </div>
  );
}
