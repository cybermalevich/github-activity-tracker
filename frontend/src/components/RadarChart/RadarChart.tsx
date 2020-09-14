import React from "react";
import Chart from "react-apexcharts";
import IRadarChartSeries from "../../utils/interfaces/IRadarChartSeries";

interface IData {
  series: IRadarChartSeries
}

const RadarChart: React.FC<IData> = ({ series }: IData) => {
  const options = {
    series: [
      {
        name: "Github Activity",
        data: [series.codeReviewsQty, series.issuesQty, series.pullRequestsQty, series.commitsQty]
      }
    ],
    labels: ["Code review", "Issues", "Pull requests", "Commits"],
    tooltip: {
      enabled: false
    },
    fill: {
      colors: ["#8cc665"],
      opacity: .8
    },
    xaxis: {
      labels: {
        style: {
          fontSize: "20px"
        }
      }
    },
    chart: {
      toolbar: {
        show: false
      }
    }
  };

  return <div>
    <Chart options={options} series={options.series} type="radar" width={800}/>
  </div>;
};

export default RadarChart;