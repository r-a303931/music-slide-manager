import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import VerseEditor from '../../components/VerseEditor';
import VerseOrderEditor from '../../components/VerseOrderEditor';
import { Song, Verse } from '../../types';
import { SocketProps } from '../management';

import './songcreate.css';

interface SongError {
	error: {
		name: string;
		verses: string;
	};
}

export default class SongEdit extends React.Component<
	SocketProps & RouteComponentProps<any>,
	Song & SongError
> {
	public state = {
		error: {
			name: '',
			verses: ''
		},
		name: '',
		slideOrdering: [],
		verses: []
	};

	constructor(props: SocketProps & RouteComponentProps<any>) {
		super(props);

		this.updateName = this.updateName.bind(this);
		this.updateVerses = this.updateVerses.bind(this);
		this.updateOrder = this.updateOrder.bind(this);

		this.onSubmit = this.onSubmit.bind(this);
	}

	public componentDidMount() {
		this.props.socket.emit('get song', this.props.match.params.songname, (song: string) => {
			// tslint:disable-next-line:no-console
			console.log(song);

			const parsed: Song = JSON.parse(song);

			this.setState({
				error: {
					name: '',
					verses: ''
				},
				name: parsed.name,
				slideOrdering: parsed.slideOrdering,
				verses: parsed.verses
			});
		});
	}

	public render() {
		return (
			<div>
				<div className="song-info">
					<div className="song-info-label">
						<h2>Song name</h2>
					</div>
					<div className="song-info-input">
						<input
							value={this.state.name}
							onChange={this.updateName}
						/>
						{this.state.error.name !== '' ? (
							<span className="create-error">
								{this.state.error.name}
							</span>
						) : null}
					</div>
				</div>
				<div>
					<VerseOrderEditor
						onChange={this.updateOrder}
						currentSlideOrdering={this.state.slideOrdering}
						verses={this.state.verses}
					/>
				</div>
				<div>
					<VerseEditor
						error={this.state.error.verses}
						onChange={this.updateVerses}
						verses={this.state.verses}
					/>
				</div>
				<div className="submit-row">
					<button onClick={this.onSubmit}>
						Save song
					</button>
				</div>
			</div>
		);
	}

	private updateName(e: React.ChangeEvent<HTMLInputElement>) {
		const name = e.target.value;

		this.setState(prev => ({
			error: {
				...prev.error,
				name: name === '' ? 'Please provide a name' : ''
			},
			name
		}));
	}

	private checkForValidVerses = (verses: Verse[]) =>
		verses
			.map(v => v.name !== '')
			.reduce((prev, curr) => prev && curr, true);

	private updateVerses(verses: Verse[]) {
		const valid = this.checkForValidVerses(verses);

		this.setState(prev => ({
			error: {
				...prev.error,
				verses: !valid ? 'Please provide a name for all the verses' : ''
			},
			verses
		}));
	}

	private updateOrder(slideOrdering: number[]) {
		this.setState({
			slideOrdering
		});
	}

	private onSubmit() {
		if (this.checkForValidVerses(this.state.verses) && this.state.name !== '') {
			this.props.socket.emit('update song contents', {
				name: this.state.name,
				slideOrdering: this.state.slideOrdering,
				verses: this.state.verses
			}, () => {
				this.props.history.replace('/management/songedit/' + this.state.name);
			});
		}
	}
}
