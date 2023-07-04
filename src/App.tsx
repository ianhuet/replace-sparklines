import { useState } from "react";

import { Sparklines, SparklinesBars } from 'react-sparklines'

import { renderDynamicBarChart } from "./charts";
import { useD3, useInterval } from './hooks'

const chartConfig = {
  height: 30,
  maxValue: 2400,
  numBars: 40,
  width: 240,
}

export default function App() {
  const padArray = (source: number[], length: number) => {
    const zeros = Array(length).fill(10)
    return zeros.map((_n, i) => source[i] ? source[i] : zeros[i])
  }
  
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [stateData, setStateData] = useState<number[]>(padArray([], 40));
  const [increasing, setIncreasing] = useState<boolean>(true);

  // const genRandomInt = (maxValue: number) => Math.abs(Math.floor(Math.random() * maxValue))

  const getValue = () => {
    const maxValue = 2400
    const lastValue = stateData[stateData.length-1]
    const num = 200 // genRandomInt(500)

    if (lastValue >= maxValue) {
      setIncreasing(false)
      return lastValue - num
    } else if (lastValue <= 200) {
      setIncreasing(true)
      return lastValue + num
    }

    return increasing ? lastValue + num : lastValue - num
  }

  useInterval(() => {
    setStateData(
      [...stateData, getValue()]
    )
  }, isRunning ? 500 : null);

  const chartProps = {
    data: stateData.slice(-chartConfig.numBars),
    config: chartConfig,
  }

  const chartElement = useD3(renderDynamicBarChart, chartProps, [chartProps.data[chartProps.data.length-1]]);
  const toggleRunning = () => setIsRunning(!isRunning)

  return (
    <div className="App">
      <h2>Sparklines Replacement</h2>

      <ul className="inlineElements">
        <li>
          <button disabled={isRunning} onClick={toggleRunning}>Start</button>
        </li>
        <li>
          <button disabled={!isRunning} onClick={toggleRunning}>Stop</button>
        </li>
      </ul>

      <div ref={chartElement} />

      <br/><br/>

      <Sparklines
        data={chartProps.data}
        min={0}
        max={chartConfig.maxValue}
        margin={10}
        svgHeight={40}
        svgWidth={240}
      >
        <SparklinesBars
          style={{ fill: 'MediumSeaGreen' }}
          margin={0}
          barWidth={4}
        />
      </Sparklines>
    </div>
  );
}
