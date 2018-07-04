import * as React from 'react';
import * as io from 'socket.io-client';

import SigninForm from '../components/SigninForm';
import {
	getCurrentSlideFromLinearIndex,
	getFullVerses,
	getSlideAfter,
	getSlideVerseIndexInFullSong,
	getVerseIndexFromLinearIndex,
	Song,
} from '../types';
import { empty } from './management/presentation/present';

import './singer.css';

export default class Singer extends React.Component<
	{},
	{
		authorized: boolean;
		currentSong: Song;
		currentSlideIndex: number;
	}
> {
	public state = {
		authorized: false,
		currentSlideIndex: 0,
		currentSong: empty
	};

	private socket: SocketIOClient.Socket;

	constructor(props: {}) {
		super(props);

		this.onAuthorize = this.onAuthorize.bind(this);

		this.loadSongAndSlide = this.loadSongAndSlide.bind(this);
		this.receiveNewSong = this.receiveNewSong.bind(this);
		this.setSlideIndex = this.setSlideIndex.bind(this);
	}

	public componentDidMount() {
		this.socket = io.connect(
			'/',
			{
				path: '/api/ws'
			}
		);

		this.socket.on('load song and slide', this.loadSongAndSlide);
		this.socket.on('update slide', this.setSlideIndex);
		this.socket.on('load song', this.receiveNewSong);
	}

	public componentWillUnmount() {
		this.socket.removeAllListeners();
		this.socket.disconnect();
	}

	public render() {
		return this.state.authorized ? (
			this.renderAuthorized()
		) : (
			<SigninForm onAuthorize={this.onAuthorize} />
		);
	}

	private renderAuthorized() {
		const maxSlideCount = getFullVerses(this.state.currentSong)
			.map(verse => verse.slides.length)
			.reduce((prev, curr) => Math.max(prev, curr));
		const nextSlide = getSlideAfter(
			this.state.currentSong,
			this.state.currentSlideIndex
		);

		return (
			<div className="singer-box">
				<div className="singer-verse-view">
					<div className="singer-current-song-name">
						{this.state.currentSong.name}
					</div>
					{getFullVerses(this.state.currentSong).map((verse, i) => (
						<div
							className={
								'singer-verse-item' +
								(i ===
								getVerseIndexFromLinearIndex(
									this.state.currentSong,
									this.state.currentSlideIndex
								)
									? ' singer-current-verse'
									: '')
							}
						>
							<div className="singer-verse-name">{verse.name}</div>
							<div className="slides">
								{verse.slides.map((_, j) => (
									<div
										className={
											'singer-slide-item' +
											(j === getSlideVerseIndexInFullSong(
												this.state.currentSong,
												this.state.currentSlideIndex
											) ? ' singer-current-slide' : '')
										}
										style={{
											width: `${100 *
												(1 /
													maxSlideCount)}%`
										}}
										key={j}
									/>
								))}
							</div>
						</div>
					))}
				</div>
				<div className="current-slide-view">
					{getCurrentSlideFromLinearIndex(
						this.state.currentSong,
						this.state.currentSlideIndex
					)
						.text.split('\n')
						.map((t, j) => <div key={j}>{t}</div>)}
				</div>
				<div className="next-slide-view">
					{nextSlide === null ? (
						<div>&lt;no text&gt;</div>
					) : (
						nextSlide.text
							.split('\n')
							.map((t, j) => <div key={j}>{t}</div>)
					)}
				</div>
			</div>
		);
	}

	private onAuthorize() {
		this.setState({
			authorized: true
		});
	}

	private receiveNewSong(song: Song) {
		this.setState({
			currentSlideIndex: 0,
			currentSong: song
		});
	}

	private loadSongAndSlide({
		currentSong,
		currentIndex
	}: {
		currentSong: Song;
		currentIndex: number;
	}) {
		this.setState({
			currentSlideIndex: currentIndex,
			currentSong
		});
	}

	private setSlideIndex(currentIndex: number) {
		this.setState({
			currentSlideIndex: currentIndex
		});
	}
}
