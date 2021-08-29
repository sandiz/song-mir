import uiReducer, { UIState, setDarkMode } from "./ui";

describe("ui reducer", () => {
  const initialState: UIState = {
    darkMode: false,
    media: {
      state: "paused",
    },
    dialog: {
      id: null,
      state: "closed",
    },
  };

  it("should handle initial state", () => {
    expect(uiReducer(undefined, { type: "unknown" })).toEqual({
      darkMode: false,
      media: {
        state: "paused",
      },
      dialog: {
        id: null,
        state: "closed",
      },
    });
  });

  it("should handle setDarkMode", () => {
    const actual = uiReducer(initialState, setDarkMode(true));
    expect(actual.darkMode).toEqual(true);
  });
});
