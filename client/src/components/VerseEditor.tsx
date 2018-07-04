import * as React from 'react';
import { Slide, Verse } from '../types';
import SlidesModifier from './SlidesModifier';

import './VerseEditor.css';

interface VerseEditorProps {
	verses: Verse[];
	onChange: (verses: Verse[]) => void;
	error: string;
}

export default class VerseEditor extends React.Component<
	VerseEditorProps,
	{
		verseCount: number;
	}
> {
	public state = {
		verseCount: 1,
	};

	constructor(props: VerseEditorProps) {
		super(props);

		this.state = {
			verseCount: 1,
		};

		this.addVerse = this.addVerse.bind(this);
		this.getVerseNameModifier = this.getVerseNameModifier.bind(this);
		this.getVerseSlideModifier = this.getVerseSlideModifier.bind(this);
		this.getVerseSlideAdder = this.getVerseSlideAdder.bind(this);
		this.getVerseRemover = this.getVerseRemover.bind(this);
	}

	public render() {
		return (
			<div className="verse-editor">
				<div className="verse-editor-info">
					<h2>Edit verses</h2>
					<button onClick={this.addVerse}>Add verse</button>
				</div>
				<div className="verse-editor-list">
					{this.props.error !== '' ? (
						<>
							<span className="create-error">
								{this.props.error}
							</span>
							<br />
						</>
					) : null}
					{this.props.verses.map((v, i) => (
						<div key={i} className="verse-instance">
							<div className="verse-instance-info">
								<span className="verse-name-label">
									Verse name:
								</span>
								<input
									onChange={this.getVerseNameModifier(v, i)}
									value={v.name}
								/>
								<br />
								<br />
								<button onClick={this.getVerseRemover(i)}>
									Remove verse
								</button>
								<button onClick={this.getVerseSlideAdder(v, i)}>
									Add slide
								</button>
							</div>
							<div className="verse-slides-editor">
								<SlidesModifier
									slides={v.slides}
									onChange={this.getVerseSlideModifier(v, i)}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	private addVerse() {
		const verses = this.props.verses.slice();

		verses.push({
			name: `Verse ${this.state.verseCount}`,
			slides: []
		});

		this.props.onChange(verses);

		this.setState(prev => ({ verseCount: prev.verseCount + 1 }));
	}

	private getVerseNameModifier(verse: Verse, index: number) {
		return ((e: React.ChangeEvent<HTMLInputElement>) => {
			const verses = this.props.verses.slice();

			verses[index] = {
				...verse,
				name: e.target.value
			};

			this.props.onChange(verses);
		}).bind(this);
	}

	private getVerseSlideModifier(verse: Verse, index: number) {
		return ((slides: Slide[]) => {
			const verses = this.props.verses.slice();

			verses[index] = {
				...verse,
				slides
			};

			this.props.onChange(verses);
		}).bind(this);
	}

	private getVerseRemover(index: number) {
		return (() => {
			const verses = this.props.verses.slice();

			verses.splice(index, 1);

			this.props.onChange(verses);
		}).bind(this);
	}

	private getVerseSlideAdder(verse: Verse, index: number) {
		return (() => {
			const verses = this.props.verses.slice();
			const slides = verses[index].slides.slice();

			slides.push({
				text: ''
			});

			verses[index] = {
				...verse,
				slides
			};

			this.props.onChange(verses);
		}).bind(this);
	}
}
