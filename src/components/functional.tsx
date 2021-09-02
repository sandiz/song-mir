import classNames from "classnames";
import React, { MutableRefObject, RefObject, useEffect, useRef } from "react";
import { Popover, Button, Card, Classes, Elevation, Icon, Menu, MenuDivider, MenuItem, Position, Text } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import * as nothumb from 'src/assets/nothumb.jpg';
import { ExtClasses } from "src/lib/types";
import { useAppSelector } from "src/lib/hooks";
import { MediaStatesEnum } from "src/lib/reducers/media";
import SliderExtended from "./extended";
import { sec2time } from "src/lib/utils";
import { importLocalFile } from "src/lib/mediaUtils";
import { closeProject } from "src/lib/projectUtils";
import MediaPlayer from "src/lib/mediaPlayer";
import { connector, PropsFromRedux } from "src/lib/store";

export interface BasicProps {
	className?: string;
}
export function AlbumArt(props: BasicProps & {
	url?: string;
	onClick?(): void;
	interactive?: boolean;
}): React.ReactElement {
	const elevation = props.url ? Elevation.FOUR : Elevation.TWO;

	return (
		<div className={props.className}>
			<Card interactive={typeof (props.interactive) !== 'undefined' ? props.interactive : true} elevation={elevation} className="album-art-card" onClick={props.onClick}>
				<img src={!props.url ? nothumb.default : props.url} alt="album art" width="100%" height="100%" />
			</Card>
		</div>
	);
}

export function MediaDetails(props: BasicProps): React.ReactElement {
	const metadata = useAppSelector((state) => state.metadata);
	const { artist = "-", album = "-", title = '-', loaded } = metadata;

	return (
		<div className={props.className}>
			<Text ellipsize className={ExtClasses.TEXT_LARGER}>{title}</Text>
			{
				loaded === false
					? <Text>No Media Loaded</Text>
					: <Text>
						<span className={Classes.TEXT_MUTED}>from</span>
						<span>&nbsp;{album}</span>
						<span className={Classes.TEXT_MUTED}>&nbsp;by</span>
						<span>&nbsp;{artist}</span>
					</Text>
			}
		</div>
	)
}

export function MediaControls(props: BasicProps) {
	const { state } = useAppSelector((state) => state.media);

	return (
		<div className={props.className}>
			<Button icon={<Icon icon={IconNames.FastBackward} size={20} />} large className={Classes.ELEVATION_2} onClick={() => MediaPlayer.rewind()} />

			<Button
				type="button"
				active={state === MediaStatesEnum.PLAYING}
				icon={(
					<Icon
						icon={state === MediaStatesEnum.PLAYING ? IconNames.Pause : IconNames.Play}
						size={35} />
				)}
				className={classNames(Classes.ELEVATION_2, "media-play-button")}
				onClick={MediaPlayer.playPause}
			/>

			<Button icon={<Icon icon={IconNames.FastForward} size={20} />} large className={Classes.ELEVATION_2} onClick={() => MediaPlayer.ffwd()} />
		</div>
	)
}

export function MediaProgressComponent(props: BasicProps & PropsFromRedux) {
	const ref: RefObject<HTMLDivElement> = useRef(null);
	let raf: MutableRefObject<number | null> = useRef(null);
	let sliderRef: RefObject<SliderExtended> = useRef(null);

	useEffect(() => {
		const _draw = () => {
			const value = MediaPlayer.wavesurfer?.getCurrentTime() || 0;
			if (ref.current) {
				ref.current.childNodes[0].nodeValue = sec2time(value, true);
				raf.current = requestAnimationFrame(_draw);
			}
		}

		switch (props.media.state) {
			case MediaStatesEnum.PAUSED:
				break;
			case MediaStatesEnum.PLAYING:
				if (raf.current === null) {
					raf.current = requestAnimationFrame(_draw);
					sliderRef.current?.mediaReady();
				}
				break;
			case MediaStatesEnum.LOADING:
			default:
				if (ref.current) {
					ref.current.innerText = sec2time(0, true);
				}
				raf.current = requestAnimationFrame(_draw);
				sliderRef.current?.mediaReady();
				break;
		}

		if (!props.project.loaded) {
			raf.current && cancelAnimationFrame(raf.current);
			sliderRef.current && sliderRef.current.mediaReset();
		}
	}, [props.media.state, raf, props.project.loaded])

	return (
		<div className={props.className}>
			<div className="media-progress-timer">
				<div
					ref={ref}
					id="progress-time"
					className={classNames("number", ExtClasses.TEXT_LARGER_2, "progress-time")}>
					00:00.000
				</div>
			</div>
			<div className="media-bar-progress-bar">
				<div className={classNames("progress-start", Classes.TEXT_DISABLED, Classes.TEXT_SMALL, "number")}>00:00</div>
				<div className="progressbar">
					<SliderExtended
						ref={sliderRef}
						stepSize={1}
						timerSource={MediaPlayer.getCurrentTime}
						min={0}
						max={MediaPlayer.getDuration()}
						labelRenderer={false}
						dragStart={(v) => MediaPlayer.seekTo(v / MediaPlayer.getDuration())}
						dragEnd={(v) => MediaPlayer.seekTo(v / MediaPlayer.getDuration())}
					/>
				</div>
				<div className={classNames("progress-end", Classes.TEXT_DISABLED, Classes.TEXT_SMALL, "number")}>{sec2time(MediaPlayer.getDuration())}</div>
			</div>
		</div>
	)
}
export const MediaProgress = connector(MediaProgressComponent);


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
				onClick={closeProject} />
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
					onClick={importLocalFile} />
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