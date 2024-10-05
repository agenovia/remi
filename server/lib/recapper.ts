import dayjs from "dayjs";
import { PineconeHandler } from "./handlers";

type timeFrame = "day" | "week" | "month";

type timeWindow = {
  from: string;
  to: string;
};

class Recapper {
  handler: PineconeHandler;

  constructor(handler: PineconeHandler) {
    this.handler = handler;
  }

  private getTimeFrameFilter(frame: timeFrame) {
    const timestamp = dayjs().startOf("day").subtract(1, frame).valueOf();
    const filter = { timestamp: { $gte: timestamp } };
    return filter;
  }

  private getTimeWindowFilter(window: timeWindow) {
    // TODO(agenovia) we need some data validation that `from` is before `to`
    const from = dayjs(window.from).valueOf();
    const to = dayjs(window.to).valueOf();
    const filter = {
      $and: [{ timestamp: { $gte: from } }, { timestamp: { $lte: to } }],
    };
    return filter;
  }

  getFilter(timeSpan: timeFrame | timeWindow) {
    if (typeof timeSpan === "string") {
      return this.getTimeFrameFilter(timeSpan);
    } else {
      return this.getTimeWindowFilter(timeSpan);
    }
  }

  recap = async (timeSpan: timeFrame | timeWindow, query?: string) => {
    const metadata = this.getFilter(timeSpan);
    return await this.handler.retrieve(query, metadata);
  };
}

export default Recapper;
