import uiReducer, { UIState, setDarkMode } from "./ui";

describe("ui reducer", () => {
  const initialState: UIState = {
    darkMode: false,
    dialog: {
      id: null,
      state: "closed",
    },
  };

  it("should handle initial state", () => {
    expect(uiReducer(undefined, { type: "unknown" })).toEqual({
      darkMode: false,
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
