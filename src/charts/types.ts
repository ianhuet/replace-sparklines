import * as d3 from 'd3'

export type SvgElement = d3.Selection<SVGSVGElement, unknown, null, undefined>

export type TargetElement = ReturnType<typeof d3.select>
