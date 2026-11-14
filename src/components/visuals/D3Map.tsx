// @ts-nocheck
'use client';

import React, { useEffect, useRef, useContext } from 'react';
import { Feature, FeatureCollection, Geometry } from 'geojson';
import { VoteData } from '@/types/propdata';
import GradientBar from '../ui/Key';
import * as d3 from 'd3';
import { SelectedPropContext } from '@/context/SelectedPropContext';
import { NO_STRONG, NO_MID, PASS_LINE, YES_MID, YES_STRONG } from '@/lib/colors';

type MapProps = {
  propositionId?: number;
  year?: number;
  voteData?: VoteData[];
  variant?: 'counties' | 'population';
};

type CountyProperties = {
  name: string;
  [key: string]: any;
};

// Anchors spread across the state. Metro suburbs are left out so they do not pile onto Denver.
const CITIES: { name: string; lon: number; lat: number; primary: boolean }[] = [
  { name: 'Fort Collins', lon: -105.0844, lat: 40.5853, primary: true },
  { name: 'Denver', lon: -104.9903, lat: 39.7392, primary: true },
  { name: 'Grand Junction', lon: -108.5506, lat: 39.0639, primary: true },
  { name: 'Colorado Springs', lon: -104.8214, lat: 38.8339, primary: true },
  { name: 'Pueblo', lon: -104.6091, lat: 38.2544, primary: false },
  { name: 'Durango', lon: -107.8801, lat: 37.2753, primary: false },
];

export function ColoradoMap({ propositionId, year, voteData = [], variant = 'counties' }: MapProps) {
  //const { name: propositionName } = useContext(SelectedPropContext);
  const SelectedProp = useContext(SelectedPropContext)
  const propositionName  = SelectedProp ?SelectedProp.name : '';
  const voteDataFromContext = SelectedProp ? SelectedProp.votes : [];
  const finalVoteData = voteDataFromContext.length > 0 ? voteDataFromContext : voteData;
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<d3.Selection<HTMLDivElement, unknown, HTMLElement, any>>();
  const passPercentage = SelectedProp?.passed_percentage ?? 50;
  console.log("Pass percentage is ", SelectedProp);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

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

    function getVotes(county_name: string) {
      const countyData = finalVoteData.find(d => d.county_name === county_name);
      if (!countyData) return { votesFor: 0, votesAgainst: 0, turnout: 0 };
      return {
        votesFor: countyData.yes_count,
        votesAgainst: countyData.no_count,
        turnout: countyData.total_votes
      };
    }

    function yesShare(county_name: string) {
      const { votesFor, votesAgainst } = getVotes(county_name);
      const total = votesFor + votesAgainst;
      if (total === 0) return null;
      return (votesFor / total) * 100;
    }

    function county_passed(county_name: string) {
      const share = yesShare(county_name);
      if (share === null) return false;
      return share > passPercentage;
    }

    function setupcolor() {
      const threshold = passPercentage;
      return d3.scaleLinear<string>()
        .domain([
          0,
          threshold / 2,
          threshold,
          threshold + (100 - threshold) / 2,
          100,
        ])
        .range([NO_STRONG, NO_MID, PASS_LINE, YES_MID, YES_STRONG])
        .clamp(true);
    }

    function getColor(county_name: string) {
      const share = yesShare(county_name);
      if (share === null) return '#d4d4d4';
      return setupcolor()(share);
    }

    function render(us: FeatureCollection<Geometry, CountyProperties>) {
      const width = containerRef.current?.clientWidth || 640;
      const height = Math.max(420, containerRef.current?.clientHeight || Math.round(width * 0.8));
    
      const population = variant === 'population';
      const titleHeight = 50;
      const legendReserve = population ? 86 : 70;
      const mapHeight = height - titleHeight - legendReserve;
    
      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height);
    
      // Clear previous content
      svg.selectAll('*').remove();
    
      // Title Section
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', titleHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', 18)
        .attr('font-weight', 'bold')
        .attr('fill', '#333')
        .text(propositionName || 'Select a Proposition');
    
      // Group for the map to isolate transforms
      const mapGroup = svg.append('g')
        .attr('transform', `translate(0, ${titleHeight})`);
    
      // Setup projection and path for the map
      const projection = d3.geoMercator().fitSize([width, mapHeight], us);
      const path = d3.geoPath().projection(projection);

      function voteTotal(countyName: string) {
        const votes = getVotes(countyName);
        return votes.votesFor + votes.votesAgainst;
      }

      function compactVotes(value: number) {
        if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
        if (value >= 10_000) return `${Math.round(value / 1000)}k`;
        return value.toLocaleString();
      }

      function showTooltip(event, countyName: string) {
        const votes = getVotes(countyName);
        const share = yesShare(countyName);
        const result = share === null
          ? 'No votes recorded'
          : `${share.toFixed(1)}% yes · ${county_passed(countyName) ? 'Passed' : 'Did not pass'}`;

        tooltipRef.current
          ?.style('opacity', 1)
          ?.html(`
            <div class="font-medium text-gray-900 mb-1">${countyName} County</div>
            <div class="text-gray-700">
              ${result}<br/>
              Votes cast: ${voteTotal(countyName).toLocaleString()}<br/>
              Votes For: ${votes.votesFor.toLocaleString()}<br/>
              Votes Against: ${votes.votesAgainst.toLocaleString()}
            </div>
          `)
          ?.style('left', (event.pageX + 10) + 'px')
          ?.style('top', (event.pageY - 20) + 'px');
      }

      function moveTooltip(event) {
        tooltipRef.current
          ?.style('left', (event.pageX + 10) + 'px')
          ?.style('top', (event.pageY - 20) + 'px');
      }

      const maxVotes = d3.max(us.features, (d) => voteTotal(d.properties.name)) || 1;
      const maxRadius = Math.max(14, Math.min(22, Math.min(width, mapHeight) * 0.065));
      const radius = d3.scaleSqrt().domain([0, maxVotes]).range([0, maxRadius]);

      const counties = mapGroup
        .append('g')
        .attr('class', 'counties')
        .selectAll('path')
        .data(us.features)
        .enter()
        .append('path')
        .attr('fill', (d) => population ? '#f4f2ef' : getColor(d.properties.name))
        .attr('d', path)
        .attr('stroke', population ? '#a8a29e' : '#333')
        .attr('stroke-width', population ? 0.6 : 0.5);

      counties
        .on('mouseenter', (event, d) => showTooltip(event, d.properties.name))
        .on('mousemove', moveTooltip)
        .on('mouseleave', () => tooltipRef.current?.style('opacity', 0));

      if (population) {
      const dots = mapGroup
        .append('g')
        .attr('class', 'population-dots')
        .selectAll('circle')
        .data(
          us.features
            .map((feature) => {
              const name = feature.properties.name;
              const cast = voteTotal(name);
              const [x, y] = path.centroid(feature);
              return { name, cast, x, y };
            })
            .filter((d) => d.cast > 0 && Number.isFinite(d.x) && Number.isFinite(d.y))
            .sort((a, b) => b.cast - a.cast)
        )
        .enter()
        .append('circle')
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        .attr('r', (d) => Math.max(2.5, radius(d.cast)))
        .attr('fill', (d) => getColor(d.name))
        .attr('fill-opacity', 0.92)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.25)
        .style('cursor', 'pointer');

      dots
        .on('mouseenter', function (event, d) {
          d3.select(this).attr('stroke', '#111').attr('stroke-width', 2);
          showTooltip(event, d.name);
        })
        .on('mousemove', moveTooltip)
        .on('mouseleave', function () {
          d3.select(this).attr('stroke', '#fff').attr('stroke-width', 1.25);
          tooltipRef.current?.style('opacity', 0);
        });
      }

      const showEveryLabel = width >= 640;
      const cities = mapGroup.append('g')
        .attr('class', 'cities')
        .style('pointer-events', 'none');

      CITIES.forEach((city) => {
        const point = projection([city.lon, city.lat]);
        if (!point) return;
        const [x, y] = point;

        if (!population) {
          cities.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 3.5)
            .attr('fill', '#111')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5);
        }

        if (city.primary || showEveryLabel) {
          cities.append('text')
            .attr('x', x + 7)
            .attr('y', y + 4)
            .attr('font-size', 11)
            .attr('font-weight', 600)
            .attr('fill', '#111')
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)
            .attr('paint-order', 'stroke')
            .text(city.name);
        }
      });

      const gradientGroup = svg.append('g')
        .attr('transform', `translate(0, ${titleHeight + mapHeight + 8})`);

      let sizeCursor = 0;
      if (population) {
        const sizeValues = [10_000, 50_000, 100_000, 250_000, 500_000, 1_000_000]
          .filter((value) => value <= maxVotes * 0.72)
          .slice(-2);
        sizeValues.push(maxVotes);

        sizeCursor = 2;
        const dotBaseline = 16 + maxRadius * 2;
        const sizeMarks = sizeValues.map((value) => {
          const r = Math.max(2.5, radius(value));
          const cx = sizeCursor + r;
          sizeCursor += r * 2 + 14;
          return { value, r, cx };
        });

        gradientGroup.append('text')
          .attr('x', 2)
          .attr('y', 11)
          .attr('font-size', 12)
          .attr('fill', '#333')
          .text('Votes cast');

        sizeMarks.forEach(({ value, r, cx }) => {
          gradientGroup.append('circle')
            .attr('cx', cx)
            .attr('cy', dotBaseline - r)
            .attr('r', r)
            .attr('fill', '#f4f2ef')
            .attr('stroke', '#333')
            .attr('stroke-width', 1);
          gradientGroup.append('text')
            .attr('x', cx)
            .attr('y', dotBaseline + 12)
            .attr('text-anchor', 'middle')
            .attr('font-size', 10)
            .attr('fill', '#333')
            .text(compactVotes(value));
        });
      }
    
      // Define the gradient
      const defs = svg.append('defs');
      const gradient = defs.append('linearGradient')
        .attr('id', 'legend-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');
    
      const threshold = passPercentage;
      const legendStops = [
        [0, NO_STRONG],
        [threshold / 2, NO_MID],
        [threshold, PASS_LINE],
        [threshold + (100 - threshold) / 2, YES_MID],
        [100, YES_STRONG],
      ];
      legendStops.forEach(([offset, color]) => {
        gradient.append('stop')
          .attr('offset', `${offset}%`)
          .attr('stop-color', color);
      });
    
      // Draw the gradient bar
      const barHeight = 16;
      const barX = population ? sizeCursor + 8 : Math.max(8, (width - Math.min(420, width - 32)) / 2);
      const barWidth = population
        ? Math.max(100, width - barX - 8)
        : Math.max(160, Math.min(420, width - 32));
      const barY = population ? 16 + maxRadius - barHeight / 2 : 16;

      gradientGroup.append('text')
        .attr('x', barX + barWidth / 2)
        .attr('y', barY - 6)
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('fill', '#333')
        .text('Yes share');

      gradientGroup.append('rect')
        .attr('x', barX)
        .attr('y', barY)
        .attr('width', barWidth)
        .attr('height', barHeight)
        .attr('fill', 'url(#legend-gradient)')
        .attr('stroke', '#333')
        .attr('stroke-width', 1);

      const passX = barX + (barWidth * (passPercentage / 100));
      gradientGroup.append('line')
        .attr('x1', passX)
        .attr('x2', passX)
        .attr('y1', barY - 2)
        .attr('y2', barY + barHeight + 2)
        .attr('stroke', '#333')
        .attr('stroke-width', 1.5);

      [
        { x: barX, anchor: 'start', label: 'No' },
        { x: passX, anchor: 'middle', label: `${passPercentage}%` },
        { x: barX + barWidth, anchor: 'end', label: 'Yes' },
      ].forEach(({ x, anchor, label }) => {
        gradientGroup.append('text')
          .attr('x', x)
          .attr('y', barY + barHeight + 14)
          .attr('text-anchor', anchor)
          .attr('font-size', 12)
          .attr('fill', '#333')
          .text(label);
      });
    }
    

    let cancelled = false;
    let observer: ResizeObserver | null = null;

    fetch('https://raw.githubusercontent.com/earthlab/earthpy/refs/heads/main/earthpy/example-data/colorado-counties.geojson')
      .then(response => response.json())
      .then((countyData: FeatureCollection<Geometry, CountyProperties>) => {
        if (cancelled) return;
        render(countyData);
        if (containerRef.current) {
          observer = new ResizeObserver(() => render(countyData));
          observer.observe(containerRef.current);
        }
      })
      .catch(error => {
        console.error('Error loading county data:', error);
      });

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (tooltipRef.current) {
        tooltipRef.current.remove();
      }
    };
  }, [finalVoteData, propositionName, passPercentage, variant]);

  return (
    <div ref={containerRef} className="relative h-[70vw] min-h-[24rem] w-full max-h-[40rem]">
      <svg ref={svgRef} id="map-svg" className="w-full h-full" />
    </div>
  );
}