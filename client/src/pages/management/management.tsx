import * as React from 'react';
import { Link, Route } from 'react-router-dom';
import { Song } from '../../types';
import { SocketProps } from '../management';

import CreatePresentation from './presentation/createPresentation';
import Present from './presentation/present';

import './management.css';

export const GetManagementLinks = () => (
	<div className="management-links">
		<Link to="/management/present">Present</Link>
		<Link to="/management/createpresentation">Create presentation</Link>
	</div>
);

export default class Playback extends React.Component<
	SocketProps,
	{
		currentPresentation: Song[];
	}
> {
	public state = {
		currentPresentation: [] as Song[]
	};

	constructor(props: SocketProps) {
		super(props);

		this.updatePresentation = this.updatePresentation.bind(this);
	}

	public render() {
		return (
			<>
				<Route
					path="/management/present"
					render={this.getComposedPresent()}
				/>
				<Route
					path="/management/createpresentation"
					render={this.getComposedPresentationCreator()}
				/>
			</>
		);
	}

	private getComposedPresent() {
		return () => (
			<Present
				socket={this.props.socket}
				presentation={this.state.currentPresentation}
			/>
		);
	}

	private getComposedPresentationCreator() {
		return () => (
			<CreatePresentation
				socket={this.props.socket}
				updatePresentation={this.updatePresentation}
				presentation={this.state.currentPresentation}
			/>
		);
	}

	private updatePresentation(presentation: Song[]) {
		this.setState({
			currentPresentation: presentation
		});
	}
}
