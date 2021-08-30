import { Classes, Dialog } from '@blueprintjs/core';
import { FocusStyleManager } from "@blueprintjs/core";
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'src/lib/hooks';
import { setDarkMode } from 'src/lib/reducers/ui';
import { MediaBar } from './features/mediaBar/mediaBar';
import { Waveform } from './features/waveform/waveform';
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import 'typeface-inconsolata'
import 'typeface-pt-sans'
import 'src/App.scss';

const darkModeQuery = '(prefers-color-scheme: dark)';
function App() {
  const darkMode = useAppSelector((state) => state.ui.darkMode);
  const dialog = useAppSelector((state) => state.ui.dialog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const _matchQuery = (e: { matches: boolean }) => {
      dispatch(setDarkMode(e.matches));
    }

    _matchQuery(window.matchMedia(darkModeQuery));
    window.matchMedia(darkModeQuery).addEventListener('change', _matchQuery);

    return () => {
      window.matchMedia(darkModeQuery).removeEventListener('change', _matchQuery)
    }
  })

  document.body.className = "app-body " + (darkMode ? Classes.DARK : "");
  FocusStyleManager.onlyShowFocusOnTabs();

  return (
    <>
      <div className="tile-root">
        <Waveform />
      </div>
      <MediaBar />
      <Dialog
        isOpen={dialog.id !== null}
        isCloseButtonShown
        lazy
        title={''}
      />
    </>
  );
}

export default App;
