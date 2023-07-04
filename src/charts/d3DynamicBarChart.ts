import * as d3 from 'd3'

import { TargetElement } from './types' // SvgElement, 

interface Config {
  height: number
  label: {
    main: string
    x: string
    y: string
  },
  margin: {
    bottom: number
    left: number
    right: number
    top: number
  },
  maxValue: number
  numBars: number
  width: number
}

interface Props {
  config: Config,
  data: number[],
}

const selectors = {
  chart: 'd3-chart',
  props: 'd3-props-tag',
  rectsGroup: 'd3-rects-group',
  xAxis: 'd3-x-axis',
  xAxisGroup: 'd3-x-axis-group',
  yAxis: 'd3-y-axis',
  yAxisGroup: 'd3-y-axis-group',
  yAxisZeroLine: 'd3-y-axis-zero-line',
}

const defaultProps = {
  height: 100,
  label: {
    main: '',
    x: '',
    y: '',
  },
  margin: {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  maxValue: 2400,
  numBars: 40,
  width: 400,
}

let chart: any = null;
let xAxisGroup: any = null
let yAxisGroup: any = null

const maxValue = (value: number, fallbackValue: number) => value < fallbackValue ? fallbackValue : value

const setSvgDimensions = (chart: any, config: Config) => {
  chart
    .attr('class', selectors.chart)
    .attr('width', config.width)
    .attr('height', config.height)
    .attr('viewBox', [0, 0, config.width, config.height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
}

const initialRender = (targetElement: any, config: Config, data: number[]) => {
  chart = targetElement.append('svg')
  setSvgDimensions(chart, config)

  const xAxis = d3.scaleLinear().domain([0, config.numBars]).range([0, config.width])
  const yMaxValue = maxValue(d3.max(data), config.maxValue)
  const yAxis = d3.scaleLinear().domain([0, yMaxValue]).range([config.height, 0])

  xAxisGroup = chart
    .append('g')
    .attr('class', selectors.xAxisGroup)
    .attr('transform', `translate(0,${config.height - config.margin.bottom})`)
    .call(xAxis)
    .call((g: any) =>
      g
        .append('text')
        .attr('x', config.width - config.margin.right)
        .attr('y', 27)
        .attr('fill', 'currentColor')
        .text(config.label.x)
    )
  yAxisGroup = chart
    .append('g')
    .attr('class', selectors.yAxisGroup)
    .attr('transform', `translate(${config.margin.left},0)`)
    .call(yAxis)
    .call((g: any) =>
      g
        .append('text')
        .attr('x', -config.margin.left)
        .attr('y', config.label.main)
        .attr('fill', 'currentColor')
        .text(config.label.y)
    )

  xAxisGroup.node()[selectors.xAxis] = xAxis
  yAxisGroup.node()[selectors.yAxis] = yAxis
}

export function renderDynamicBarChart(targetElement: TargetElement, props: Props) {
  const { config: configProps, data } = props

  const config = {
    ...defaultProps,
    ...configProps,
  }

  if (targetElement.select('svg').empty()) {
    initialRender(targetElement, config, data)
  }

  if (data.length === 0) {
    return
  }

  xAxisGroup = chart.select(`.${selectors.xAxisGroup}`)
  yAxisGroup = chart.select(`.${selectors.yAxisGroup}`)
  const xAxis = xAxisGroup.node()[selectors.xAxis]
  const yAxis = yAxisGroup.node()[selectors.yAxis]

  const columnWidth = (config.width / config.numBars) - 1.5
  chart.selectAll('rect')
    .attr('transform', `translate(-${columnWidth},0)`)
    .data(data)
    .join(
      (enter: any) => enter
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (_d: number, i: number) => xAxis(i))
        .attr('y', (d: number) => yAxis(d))
        .attr('width', columnWidth)
        .attr('height', (d: number) => config.height - yAxis(d)),

      (exit: any) => exit
        .transition()
        .remove(),
    )
}
