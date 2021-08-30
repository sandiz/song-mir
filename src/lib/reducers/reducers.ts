import { combineReducers } from "redux";

import ui from "./ui";
import media from "./media";
import metadata from "./metadata";

export default combineReducers({
  ui,
  media,
  metadata,
});
