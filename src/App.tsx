import { Classes, Dialog } from '@blueprintjs/core';
import { FocusStyleManager } from "@blueprintjs/core";
import { Fragment, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'src/lib/hooks';
import { setDarkMode } from 'src/lib/reducers/ui';
import ErrorBoundary from './components/errorBoundary';
import { MediaPlayer } from './features/mediaPlayer/mediaPlayer';


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
    dispatch(setDarkMode(window.matchMedia(darkModeQuery).matches));
    window.matchMedia(darkModeQuery).addEventListener('change', (e) => {
      dispatch(setDarkMode(e.matches));
    });
  })

  document.body.className = "app-body " + (darkMode ? Classes.DARK : "");
  FocusStyleManager.onlyShowFocusOnTabs();

  return (
    <Fragment>
      <ErrorBoundary className="media-player">
        <MediaPlayer />
      </ErrorBoundary>
      <Dialog
        isOpen={dialog.id !== null}
        isCloseButtonShown
        lazy
        title={''}
      />
    </Fragment>
  );
}

export default App;
