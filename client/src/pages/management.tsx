import * as React from 'react';
import { NavLink, Route, RouteComponentProps } from 'react-router-dom';
import * as io from 'socket.io-client';

import Management from './management/management';
import SongCreate from './management/songcreate';
import SongEdit from './management/songedit';

import SigninForm from '../components/SigninForm';
import SongsView from './management/songview';

import './management.css';

export interface SocketProps {
	socket: SocketIOClient.Socket;
}

export default class ManagementAuth extends React.Component<
	{},
	{
		authorized: boolean;
	}
> {
	public state = {
		authorized: false
	};
	private socket: SocketIOClient.Socket;

	constructor(props: {}) {
		super(props);

		this.socket = io.connect(
			'/management',
			{
				path: '/api/ws'
			}
		);

		this.onAuthorize = this.onAuthorize.bind(this);
	}
	public componentWillUnmount() {
		this.socket.removeAllListeners();
		this.socket.disconnect();
	}
	public render() {
		return this.state.authorized ? (
			<>
				<div className="management-header">
					<h1>Song Management</h1>
					<div className="link-box">
						<NavLink
							className="management-link"
							activeClassName="selected"
							to="/management/createpresentation"
						>
							Create a presentation
						</NavLink>
						<NavLink
							className="management-link"
							activeClassName="selected"
							to="/management/present"
						>
							Present
						</NavLink>
						<NavLink
							className="management-link"
							activeClassName="selected"
							to="/management/songcreate"
						>
							Create a song
						</NavLink>
						<NavLink
							className="management-link"
							activeClassName="selected"
							to="/management/songlist"
						>
							View songs
						</NavLink>
					</div>
				</div>
				<Route
					path="/management"
					render={this.getComposedComponent(Management)}
				/>
				<Route
					path="/management/songedit/:songname"
					render={this.getComposedComponent(SongEdit)}
				/>
				<Route
					path="/management/songcreate"
					render={this.getComposedComponent(SongCreate)}
				/>
				<Route
					path="/management/songlist"
					render={this.getComposedComponent(SongsView)}
				/>
			</>
		) : (
			<SigninForm onAuthorize={this.onAuthorize} />
		);
	}

	private onAuthorize() {
		this.setState({
			authorized: true
		});
	}

	private getComposedComponent(
		Comp: typeof SongEdit | typeof SongCreate | typeof Management | typeof SongsView
	) {
		return (props: RouteComponentProps<any>) => <Comp socket={this.socket} {...props} />;
	}
}
