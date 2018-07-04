import * as React from 'react';
import { Song } from '../../../types';
import { SocketProps } from '../../management';

import './createPresentation.css';

export default class CreatePresentation extends React.Component<
	SocketProps & {
		updatePresentation: (songs: Song[]) => void;
		presentation: Song[];
	},
	{
		presentation: Song[];
		loading: boolean;
		availableSongs: Song[];
	}
> {
	public state = {
		availableSongs: [] as Song[],
		loading: true,
		presentation: this.props.presentation
	};

	public componentDidMount() {
		this.props.socket.emit('get song list', (songs: string[]) => {
			const parsed: Song[] = songs.map(s => JSON.parse(s));

			const newList: Song[] = parsed.filter(v => {
				let ret = true;
				this.state.presentation.forEach(song => {
					if (song.name === v.name) {
						ret = false;
					}
				});
				return ret;
			});

			this.setState({
				availableSongs: newList,
				loading: false
			});
		});
	}

	public render() {
		return this.state.loading ? (
			<h2>Loading...</h2>
		) : (
			<div className="song-selector">
				<div className="selected-songs">
					<h2>Selected songs</h2>
					{this.state.presentation.map((s, i) => (
						<div key={i} className="selected-song">
							<div className="selected-song-label">{s.name}</div>
							<button
								onClick={this.getSongRemover(i)}
								className="selected-song-remove"
							>
								Remove
							</button>
						</div>
					))}
				</div>
				<div className="song-selector-list">
					<h2>Available songs</h2>
					{this.state.availableSongs.map((s, i) => (
						<div
							key={i}
							onClick={this.getSongAdder(i)}
							className="available-song"
						>
							+ {s.name}
						</div>
					))}
					{this.state.availableSongs.length === 0 ? (
						<h2>No more available songs</h2>
					) : null}
				</div>
			</div>
		);
	}

	private getSongAdder(index: number) {
		return (() => {
			const newAvailableSongList = this.state.availableSongs.slice();
			const newSelectedSongList = this.state.presentation.slice();

			newSelectedSongList.push(newAvailableSongList.splice(index, 1)[0]);

			this.setState({
				availableSongs: newAvailableSongList,
				presentation: newSelectedSongList
			});

			this.props.updatePresentation(newSelectedSongList);
		}).bind(this);
	}

	private getSongRemover(index: number) {
		return (() => {
			const newAvailableSongList = this.state.availableSongs.slice();
			const newSelectedSongList = this.state.presentation.slice();

			newAvailableSongList.push(newSelectedSongList.splice(index, 1)[0]);

			this.setState({
				availableSongs: newAvailableSongList,
				presentation: newSelectedSongList
			});

			this.props.updatePresentation(newSelectedSongList);
		}).bind(this);
	}
}
