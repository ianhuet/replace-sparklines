import { useEffect, useRef } from 'react'

import * as d3 from 'd3'

import { TargetElement } from '../charts/types'

export const useD3 = <Data>(
  renderChartFn: (selection: TargetElement, data: Data) => void,
  data: Data,
  dependencies: (boolean | number | string)[]
) => {
  const ref = useRef<any>()

  useEffect(() => {
    renderChartFn(d3.select(ref.current), data)
  }, dependencies)

  return ref
}
