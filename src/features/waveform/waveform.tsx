import { Card } from "@blueprintjs/core";
import classNames from "classnames";
import ErrorBoundary from "src/components/errorBoundary";
import { BasicProps } from "src/components/functional";
import './waveform.scss';

export function WaveformComponent(props: BasicProps) {
	return (
		<Card className={classNames("waveform-container")} elevation={3}>
			<div id="chordstimeline" />
			<div id="beatstimeline" />
			<div id="waveform" className="waveform" />
			<div id="timeline" />
		</Card>
	)
}

export function Waveform() {
	return (
		<ErrorBoundary className="waveform-container">
			<WaveformComponent />
		</ErrorBoundary>
	)
}