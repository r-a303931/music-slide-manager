import * as React from 'react';
import { SocketProps } from '../../management';

import {
	getCurrentSlideFromLinearIndex,
	getFullVerses,
	getSlideAfter,
	getSlideIndexForVerse,
	getSlideVerseIndexInFullSong,
	getVerseFromLinearIndex,
	getVerseIndexFromLinearIndex,
	Song
} from '../../../types';

import './present.css';

export const empty: Song = {
	name: '',
	slideOrdering: [0],
	verses: [
		{
			name: '',
			slides: [
				{
					text: ''
				}
			]
		}
	]
};

export default class Present extends React.Component<
	SocketProps & {
		presentation: Song[];
	},
	{
		currentSongIndex: number;
		currentSlideIndex: number;
		currentViewSongIndex: number;
		currentViewSlideIndex: number;
		isEmpty: boolean;
		trackCurrentSlide: boolean;
	}
> {
	constructor(props: SocketProps & { presentation: Song[] }) {
		super(props);

		this.state = {
			currentSlideIndex: 0,
			currentSongIndex: -1,
			currentViewSlideIndex: 0,
			currentViewSongIndex: 0,
			isEmpty: true,
			trackCurrentSlide: true
		};

		this.switchTrack = this.switchTrack.bind(this);
		this.goToSong = this.goToSong.bind(this);
	}

	public currentVerse() {
		return getVerseFromLinearIndex(
			this.currentSong(),
			this.state.currentSlideIndex
		);
	}

	public currentSlide() {
		return getCurrentSlideFromLinearIndex(
			this.currentSong(),
			this.state.currentSlideIndex
		);
	}

	public currentSong() {
		return this.props.presentation[this.state.currentSongIndex];
	}

	public componentDidUpdate() {
		// this.props.socket.emit(
		// 	'load song',
		// 	this.props.presentation[this.state.currentSongIndex]
		// );
		// this.props.socket.emit(
		// 	'update slide',
		// 	this.state.currentSlideIndex
		// );
	}

	public render() {
		const nextSlide = this.state.isEmpty
			? null
			: getSlideAfter(this.currentSong(), this.state.currentSlideIndex);

		return this.props.presentation.length === 0 ? (
			<h2 className="present-error">
				Create a presentation before presenting
			</h2>
		) : (
			<div className="present-box">
				<div className="songs">
					{this.props.presentation.map((song, i) => (
						<div
							className={
								'song-item' +
								(i ===
									(this.state.trackCurrentSlide
										? this.state.currentSongIndex
										: this.state.currentViewSongIndex) &&
								!this.state.isEmpty
									? ' current'
									: '')
							}
							key={i}
							onClick={this.getSongViewer(i)}
						>
							{song.name}
						</div>
					))}
				</div>
				<div className="verses">
					{!this.state.isEmpty &&
						getFullVerses(
							!this.state.trackCurrentSlide
								? this.props.presentation[
										this.state.currentViewSongIndex
								  ]
								: this.currentSong()
						).map((verse, i) => (
							<div
								key={i}
								className={
									'verse-item' +
									(i ===
									getVerseIndexFromLinearIndex(
										!this.state.trackCurrentSlide
											? this.props.presentation[
													this.state
														.currentViewSongIndex
											  ]
											: this.currentSong(),
										this.state.trackCurrentSlide
											? this.state.currentSlideIndex
											: this.state.currentViewSlideIndex
									)
										? ' current'
										: '')
								}
								onClick={this.getVerseViewer(i)}
							>
								{verse.name} ({verse.slides.length})
							</div>
						))}
				</div>
				<div className="slides">
					{!this.state.isEmpty &&
						(this.state.trackCurrentSlide
							? this.currentVerse()
							: getVerseFromLinearIndex(
									!this.state.trackCurrentSlide
										? this.props.presentation[
												this.state.currentViewSongIndex
										  ]
										: this.currentSong(),
									this.state.currentViewSlideIndex
							  )
						).slides.map((slide, i) => (
							<div
								key={i}
								className={
									'slide-item' +
									(i ===
									getSlideVerseIndexInFullSong(
										this.currentSong(),
										this.state.currentSlideIndex
									)
										? ' current'
										: '')
								}
							>
								{slide.text
									.split('\n')
									.map((v, j) => [<div key={j}>{v}</div>])}
							</div>
						))}
				</div>
				<div className="current-info">
					<div className="current-info-header">
						{!this.state.isEmpty && (
							<>
								<div className="current-song">
									{this.currentSong().name}:{' '}
									{this.state.currentSlideIndex + 1}
									/
									{getFullVerses(this.currentSong())
										.map(v => v.slides.length)
										.reduce((prev, curr) => prev + curr, 0)}
								</div>
								<div className="current-verse">
									{this.currentVerse().name}
								</div>
							</>
						)}
					</div>
					<div className="current-slides">
						<div className="stretchy-slide">
							<div className="stretchy-slide-text">
								{!this.state.isEmpty &&
									this.currentSlide()
										.text.split('\n')
										.map((v, j) => [
											<div key={j}>{v}</div>
										])}
							</div>
						</div>
						<div className="slide-labels">
							<div className="left-label">Next slide</div>
							{nextSlide !== null ? (
								<div className="right-label">
									{
										getVerseFromLinearIndex(
											this.currentSong(),
											this.state.currentSlideIndex + 1
										).name
									}
								</div>
							) : null}
						</div>
						<div className="half-width">
							<div className="stretchy-slide">
								<div className="stretchy-slide-text">
									{nextSlide !== null ? (
										nextSlide.text
											.split('\n')
											.map((v, j) => [
												<div key={j}>{v}</div>
											])
									) : (
										<div>&lt;no text&gt;</div>
									)}
								</div>
							</div>
						</div>
						<div className="controls-box">
							<button onClick={this.goForward(-1)}>
								Go back one slide
							</button>
							<button onClick={this.goForward(1)}>
								Go to next slide
							</button>
							<button onClick={this.goForward(2)}>
								Skip next slide
							</button>
							<br />
							<input
								type="checkbox"
								checked={this.state.trackCurrentSlide}
								onChange={this.switchTrack}
							/>
							Track current slide<br />
							Go to song:
							<select value="-1" onChange={this.goToSong}>
								<option value="-1">--Pick a song--</option>
								{this.props.presentation.map((s, i) => (
									<option key={i} value={i.toString()}>
										{s.name}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
			</div>
		);
	}

	private goForward(howMuch: number) {
		return (() => {
			if (howMuch > 0 && this.state.isEmpty) {
				this.props.socket.emit(
					'load song',
					this.props.presentation[this.state.currentSongIndex + 1]
				);
				this.props.socket.emit('update slide', 0);
				this.setState(prev => ({
					currentSlideIndex: 0,
					currentSongIndex: prev.currentSongIndex + 1,
					currentViewSlideIndex: prev.trackCurrentSlide
						? 0
						: prev.currentViewSlideIndex,
					currentViewSongIndex: prev.trackCurrentSlide
						? prev.currentSongIndex + 1
						: prev.currentViewSongIndex,
					isEmpty: false
				}));
			} else if (howMuch < 0 && this.state.isEmpty) {
				const newSong = this.props.presentation[
					this.state.currentSongIndex - 1
				];
				this.props.socket.emit('load song', newSong);
				const newIndex = getFullVerses(newSong).length - 1;
				this.props.socket.emit('update slide', newIndex);
				this.setState(prev => ({
					currentSlideIndex: newIndex,
					currentSongIndex: prev.currentSongIndex - 1,
					currentViewSlideIndex: prev.trackCurrentSlide
						? newIndex
						: prev.currentViewSlideIndex,
					currentViewSongIndex: prev.trackCurrentSlide
						? prev.currentSongIndex - 1
						: prev.currentViewSongIndex,
					isEmpty: false
				}));
			} else if (
				howMuch + this.state.currentSlideIndex >=
					getFullVerses(this.currentSong())
						.map(v => v.slides.length)
						.reduce((prev, curr) => prev + curr, 0) &&
				!this.state.isEmpty
			) {
				this.props.socket.emit('load song', empty);
				this.props.socket.emit('update slide', 0);
				this.setState({
					isEmpty: true
				});
			} else {
				this.props.socket.emit(
					'update slide',
					howMuch + this.state.currentSlideIndex
				);
				this.setState(prev => ({
					currentSlideIndex: prev.currentSlideIndex + howMuch,
					currentViewSlideIndex: prev.trackCurrentSlide
						? prev.currentSlideIndex + howMuch
						: prev.currentViewSlideIndex
				}));
			}
		}).bind(this);
	}

	private switchTrack() {
		this.setState(prev => ({ trackCurrentSlide: !prev.trackCurrentSlide }));
	}

	private goToSong(e: React.ChangeEvent<HTMLSelectElement>) {
		if (e.currentTarget.value !== '-1') {
			const newSongIndex = parseInt(e.currentTarget.value, 10);
			// change currentSongIndex to the value and update the sockets
			this.setState(prev => ({
				currentSlideIndex: 0,
				currentSongIndex: newSongIndex,
				currentViewSlideIndex: prev.trackCurrentSlide
					? 0
					: prev.currentViewSlideIndex,
				currentViewSongIndex: prev.trackCurrentSlide
					? newSongIndex
					: prev.currentViewSongIndex,
				isEmpty: false
			}));

			this.props.socket.emit(
				'load song',
				this.props.presentation[newSongIndex]
			);
			this.props.socket.emit('update slide', 0);
		}
	}

	private getSongViewer(songIndex: number) {
		return (() => {
			this.setState({
				currentViewSongIndex: songIndex,
				trackCurrentSlide: false
			});
		}).bind(this);
	}

	private getVerseViewer(verseIndex: number) {
		return (() => {
			this.setState(prev => {
				const currentSong = this.props.presentation[prev.currentViewSongIndex];

				return {
					currentViewSlideIndex: getSlideIndexForVerse(currentSong, verseIndex),
					trackCurrentSlide: false
				};
			});
		}).bind(this);
	}
}
