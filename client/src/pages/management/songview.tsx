import * as React from 'react';
import { Link } from 'react-router-dom';
import { Song } from '../../types';
import { SocketProps } from '../management';

import './songslist.css';

export default class SongsView extends React.Component<
	SocketProps,
	{
		loading: boolean;
		songs: Song[];
	}
> {
	public state = {
		loading: true,
		songs: [] as Song[]
	};

	constructor(props: SocketProps) {
		super(props);

		this.getUpdate = this.getUpdate.bind(this);
	}

	public componentDidMount() {
		this.getUpdate();
	}

	public render() {
		return this.state.loading ? (
			<h2 className="loading">Loading...</h2>
		) : (
			this.renderLoaded()
		);
	}

	private renderLoaded() {
		return (
			<div className="song-list">
				{this.state.songs.length === 0 ? (
					<h2>
						There are no songs.{' '}
						<Link to="/management/songcreate">
							How about you create some!
						</Link>
					</h2>
				) : null}
				{this.state.songs.map((song, i) => (
					<div className="song-list-item" key={i}>
						<div className="song-list-item-name">{song.name}</div>
						<div className="song-list-item-editlink">
							<Link to={'/management/songedit/' + song.name}>
								Edit
							</Link>
						</div>
						<div className="song-list-item-delete">
							<button onClick={this.getDeleter(song.name)}>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
		);
	}

	private getDeleter(name: string) {
		return (() => {
			this.props.socket.emit('delete song', name, this.getUpdate);
		}).bind(this);
	}

	private getUpdate() {
		this.setState({
			loading: true
		});
		this.props.socket.emit('get song list', (songs: string[]) => {
			const parsed: Song[] = songs.map(s => JSON.parse(s));

			this.setState({
				loading: false,
				songs: parsed
			});
		});
	}
}
