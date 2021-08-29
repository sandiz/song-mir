import React from "react";
import { Popover, Button, Card, Classes, Elevation, Icon, Menu, MenuDivider, MenuItem, Position, Text } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import * as nothumb from 'src/assets/nothumb.jpg';
import { ExtClasses } from "src/lib/types";
import classNames from "classnames";
import { useAppSelector } from "src/lib/hooks";
import { MediaStatesEnum } from "src/lib/reducers/ui";
import SliderExtended from "./extended";
import { sec2time } from "src/lib/utils";

type BasicProps = {
	className?: string;
}
export function AlbumArt(props: BasicProps & {
	url?: string;
	onClick?(): void;
	interactive?: boolean;
}): React.ReactElement {
	return (
		<div className={props.className}>
			<Card interactive={typeof (props.interactive) !== 'undefined' ? props.interactive : true} elevation={Elevation.TWO} className="album-art-card" onClick={props.onClick}>
				<img src={props.url === "" ? nothumb.default : props.url} alt="album art" width="100%" height="100%" />
			</Card>
		</div>
	);
}

export function MediaDetails(props: BasicProps): React.ReactElement {
	const artist = 'Rashid Khan';
	const album = 'Aaja Nachle';
	const title = 'O Re Piya';

	return (
		<div className={props.className}>
			<Text ellipsize className={ExtClasses.TEXT_LARGER}>{title}</Text>
			<Text>
				<span className={Classes.TEXT_MUTED}>from</span>
				<span>&nbsp;{album}</span>
				<span className={Classes.TEXT_MUTED}>&nbsp;by</span>
				<span>&nbsp;{artist}</span>
			</Text>
		</div>
	)
}

export function MediaControls(props: BasicProps & {
	rewind?: () => void;
	ffwd?: () => void;
	play?: () => void;
}) {
	const state = useAppSelector((state) => state.ui.media.state);

	return (
		<div className={props.className}>
			<Button icon={<Icon icon={IconNames.FastBackward} size={20} />} large className={Classes.ELEVATION_2} onClick={props.rewind} />

			<Button
				type="button"
				active={state === MediaStatesEnum.PLAYING}
				icon={(
					<Icon
						icon={state === MediaStatesEnum.PLAYING ? IconNames.Pause : IconNames.Play}
						size={35} />
				)}
				className={classNames(Classes.ELEVATION_2, "media-play-button")}
				onClick={props.play}
			/>

			<Button icon={<Icon icon={IconNames.FastForward} size={20} />} large className={Classes.ELEVATION_2} onClick={props.ffwd} />
		</div>
	)
}

export function MediaProgress(props: BasicProps) {
	const duration = Math.random();

	return (
		<div className={props.className}>
			<div className="media-progress-timer">
				<div
					id="progress-time"
					className={classNames("number", ExtClasses.TEXT_LARGER_2, "progress-time")}>
					00:00.000
				</div>
			</div>
			<div className="media-bar-progress-bar">
				<div className={classNames("progress-start", Classes.TEXT_DISABLED, Classes.TEXT_SMALL, "number")}>00:00</div>
				<div className="progressbar">
					<SliderExtended
						stepSize={1}
						timerSource={() => 0}
						min={0}
						max={duration === 0 ? 100 : duration}
						labelRenderer={false}
						dragStart={(v) => console.log(v / duration)}
						dragEnd={(v) => console.log(v / duration)}
					/>
				</div>
				<div className={classNames("progress-end", Classes.TEXT_DISABLED, Classes.TEXT_SMALL, "number")}>{sec2time(duration)}</div>
			</div>
		</div>
	)
}

export function MainMenu(props: BasicProps) {
	const saveDisabled = false;
	const recentItems = [];

	const menuTextElement = (text: string) => (
		<div className="menuitem">
			<span>{text}</span>
			{
				//   <span className="menuitem-hotkey">{getHotkey(hotkey)}</span>
			}
		</div>
	);

	const menu = (
		<Menu large style={{ zIndex: 100 }}>
			<MenuItem
				text={menuTextElement("Open Project")}
				icon={IconNames.FolderOpen}
				onClick={console.log}
			/>
			<MenuItem
				text={menuTextElement("Save Project")}
				icon={IconNames.Download}
				disabled={saveDisabled}
				onClick={console.log} />
			<MenuItem
				text={menuTextElement("Close Project")}
				disabled={saveDisabled}
				icon={IconNames.FolderClose}
				onClick={console.log} />
			<MenuDivider />
			<MenuItem
				text={menuTextElement(`[ Analyse ]`)}
				icon={IconNames.LayoutAuto}
				onClick={console.log} />
			<MenuItem
				text={"Recent Projects"}
				icon={IconNames.History}
				disabled={recentItems.length === 0}
				popoverProps={{ openOnTargetFocus: false }}
			>
				{
					recentItems.length && (
						<React.Fragment>
							<MenuDivider />
							<MenuItem text="Clear Recents" icon={IconNames.Trash} onClick={console.log} />
						</React.Fragment>
					)
				}
			</MenuItem>
			<MenuItem
				text={"Import Media"}
				icon={IconNames.Import}
				popoverProps={{ openOnTargetFocus: false }}
			>
				<MenuItem
					text={"from Local File"}
					icon={IconNames.Download}
					onClick={console.log} />
				<MenuItem
					text={"from URL"}
					icon={IconNames.Cloud}
					onClick={console.log} />
			</MenuItem>
			<MenuDivider />
			<MenuItem text="Settings" icon={IconNames.Settings} />
			<MenuItem text="Quit" icon={IconNames.Power} onClick={console.log} />
		</Menu>
	)

	return (
		<div className={props.className}>
			<Popover
				hasBackdrop
				content={menu}
				position={Position.BOTTOM}
				portalClassName="main-menu-popover"
				interactionKind="click"
				canEscapeKeyClose
				inheritDarkTheme
				usePortal
				modifiers={{
					arrow: { enabled: true },
				}}
			>
				<Button
					icon={<Icon icon={IconNames.Properties} size={20} />}
					large
					className={Classes.ELEVATION_2}
				/>
			</Popover>
		</div>
	)
}