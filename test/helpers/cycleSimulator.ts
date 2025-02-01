import { RawModel, SportEventModel } from "../../src/models";
import { PeriodType } from "../../src/models/sportEventModel";

const DEFAULT_MAPPINGS = {
  status_pre: "PRE",
  status_live: "LIVE",
  period_current: "CURRENT",
  period_1: "PERIOD_1",
  period_2: "PERIOD_2",
  period_3: "PERIOD_3",
  period_4: "PERIOD_4",
};

class CycleSimulator {
  private mappings: RawModel.MappingDict;

  constructor() {
    this.mappings = DEFAULT_MAPPINGS;
  }

  getMappings() {
    return this.mappings;
  }
}

export default CycleSimulator;
