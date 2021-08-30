import { Button, Card, Classes, Elevation, Icon, Navbar } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import ErrorBoundary from "src/components/errorBoundary";
import { AlbumArt, MainMenu, MediaControls, MediaDetails, MediaProgress } from "src/components/functional";
import { useAppSelector } from "src/lib/hooks";
import './mediaBar.scss';

function MediaBarComponent() {
	const metadata = useAppSelector((state) => state.metadata);

	return (
		<Card className='media-player' elevation={Elevation.FOUR}>
			<MainMenu />
			<Navbar.Divider className="tall-divider" />
			<AlbumArt url={metadata.image} className="album-art-container" />
			<MediaDetails className="media-details-container" />
			<Navbar.Divider className="tall-divider" />
			<MediaControls className="media-controls-container" />
			<Navbar.Divider className="tall-divider" />
			<MediaProgress className="media-progress-container" />
			<Navbar.Divider className="tall-divider" />
			<Button icon={<Icon icon={IconNames.VolumeUp} size={20} />} large className={Classes.ELEVATION_2} />
		</Card>
	)
}

export function MediaBar() {
	return (
		<ErrorBoundary className="media-player">
			<MediaBarComponent />
		</ErrorBoundary>
	)
}