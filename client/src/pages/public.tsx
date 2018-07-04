import * as React from 'react';
import * as io from 'socket.io-client';

import { getCurrentSlideFromLinearIndex, Slide, Song } from '../types';

import './public.css';

const defaultSong: Readonly<Song> = {
	name: '',
	slideOrdering: [0],
	verses: [
		{
			name: 'default',
			slides: [
				{
					text: 'Please wait while the slides are set up'
				}
			]
		}
	]
};

export default class Public extends React.Component<
	{},
	{
		fullScreen: boolean;
		currentSong: Song;
		currentIndex: number;
	}
> {
	public state = {
		currentIndex: 0,
		currentSong: defaultSong,
		fullScreen: false
	};

	private socket: SocketIOClient.Socket;
	private publicBoxRef = React.createRef<HTMLDivElement>();

	public get currentSlide(): Slide {
		return getCurrentSlideFromLinearIndex(
			this.state.currentSong,
			this.state.currentIndex
		);
	}

	constructor(props: {}) {
		super(props);

		this.receiveNewSong = this.receiveNewSong.bind(this);
		this.loadSongAndSlide = this.loadSongAndSlide.bind(this);
		this.setSlideIndex = this.setSlideIndex.bind(this);
		this.goFullScreen = this.goFullScreen.bind(this);
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
		return (
			<>
				<div className="public-box" ref={this.publicBoxRef}>
					{this.currentSlide.text.split('\n').map((t, i) => (
						<div className="display" key={i}>
							{t}
						</div>
					))}
				</div>
				{!this.state.fullScreen ? (
					<button
						className="enter-fullscreen"
						onClick={this.goFullScreen}
					>
						Go fullscreen
					</button>
				) : null}
			</>
		);
	}

	private receiveNewSong(song: Song) {
		this.setState({
			currentIndex: 0,
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
			currentIndex,
			currentSong
		});
	}

	private setSlideIndex(currentIndex: number) {
		this.setState({
			currentIndex
		});
	}

	private goFullScreen() {
		const box = document.body;
		if (box.requestFullscreen) {
			box.requestFullscreen();
		} else if (box.webkitRequestFullscreen) {
			box.webkitRequestFullscreen();
		}
		this.setState({
			fullScreen: true
		});
	}
}
