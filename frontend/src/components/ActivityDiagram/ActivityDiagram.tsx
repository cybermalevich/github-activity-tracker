import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "./styles.css";
import { IActivityDiagramConfig } from "../../utils/interfaces/IActivityDiagramConfig";

interface IProps {
  config: IActivityDiagramConfig | null;
}

const ActivityDiagram: React.FC<IProps> = ({ config }: IProps) => {
  if (config && config.values.length === 1) {
    const date = new Date(config.values[0].date);
    date.setMonth(date.getMonth() - 3);
    config.startDate = date.toISOString();
  }

  return (<>
    {config && (<CalendarHeatmap
      {...config}
      gutterSize={0.1}
      classForValue={(value) => {

        if (!value) {
          return "color-empty";
        }

        const count = value.count > 4 ? 4 : value.count;
        return `color-github-${count}`;
      }}
      showWeekdayLabels={true}
    />)}

  </>);
};

export default ActivityDiagram;
