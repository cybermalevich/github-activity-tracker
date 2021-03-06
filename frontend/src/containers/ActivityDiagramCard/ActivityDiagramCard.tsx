import React from "react";
import useFetchData from "../../utils/hooks/useFetchData";
import { useCookies } from "react-cookie";
import { Grid, Paper, Typography } from "@material-ui/core";
import useStyles from "./styles";
import generateUrl from "../../utils/generateUrl";
import { useParams } from "react-router";
import ActivityDiagram from "../../components/ActivityDiagram/ActivityDiagram";
import { IActivityDiagramConfig, IActivityDiagramConfigValue } from "../../utils/interfaces/IActivityDiagramConfig";
import RadarChart from "../../components/RadarChart/RadarChart";
import IRadarChartSeries from "../../utils/interfaces/IRadarChartSeries";
import { ActivityTypes } from "../../constants/activity_types";

interface Commit {
  message: string;
}

interface Event {
  id: number;
  type: string;
  payload: {
    commits?: Commit[];
  };
  created_at: string;
}

interface ReceivedObj {
  rep_name: string;
  events: Event[];
}

const ActivityDiagramCard: React.FC = () => {
  const classes = useStyles();
  const [cookies] = useCookies(["access_token"]);
  const accessToken = cookies.access_token;
  const { userId, repId } = useParams();
  const userRepActivityApiUrl = generateUrl(process.env.REACT_APP_API_USER_ACTIVITY!, {
    USER_ID: userId,
    REP_ID: repId
  });
  const [{ data, isLoading }] = useFetchData<ReceivedObj>({
    method: "GET",
    url: userRepActivityApiUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const radarChartSeries: IRadarChartSeries = {
    codeReviewsQty: 0,
    issuesQty: 0,
    pullRequestsQty: 0,
    commitsQty: 0
  };
  let activityDiagramConfig: IActivityDiagramConfig | null = null;

  if (data) {
    const { events } = data;
    const values: IActivityDiagramConfigValue[] = [];
    let startDate: Date = new Date(events[events.length - 1].created_at);
    let endDate: Date = new Date(events[0].created_at);

    const eventsByDays: {
      [key: number]: Event[];
    } = {};
    for (const event of events) {
      switch (event.type) {
        case ActivityTypes.PullRequestEvent:
        {
          radarChartSeries.pullRequestsQty++;
          break;
        }
        case ActivityTypes.PushEvent: {
          radarChartSeries.commitsQty++;
          break;
        }
        case ActivityTypes.IssuesEvent: {
          radarChartSeries.issuesQty++;
        }
      }

      const date = (new Date(event.created_at));
      const timestamp = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

      eventsByDays[timestamp] = eventsByDays[timestamp] ?? [];
      eventsByDays[timestamp].push(event);
    }

    for (const [date, events] of Object.entries(eventsByDays)) {
      const preparedDate = new Date(+date).toISOString();

      values.push({
        date: preparedDate,
        count: events.length
      });
    }

    //  TODO: replace to separate func and replace calculations with constant
    const timestampMonthDiff: number = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

    if (timestampMonthDiff < 3) {
      startDate = new Date(endDate);
      startDate.setMonth(endDate.getMonth() - 3);
    }

    activityDiagramConfig = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      values
    };
  }

  return (<>
    {!isLoading && data && (
      <Grid item xs={12} className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="h6">
            My activity on {data.rep_name}
          </Typography>
          <div>
            <ActivityDiagram config={activityDiagramConfig}/>
          </div>
          <RadarChart series={radarChartSeries}/>
        </Paper>
      </Grid>
    )}
  </>);
};

export default ActivityDiagramCard;
