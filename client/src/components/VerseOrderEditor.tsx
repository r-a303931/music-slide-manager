import * as React from 'react';
import { Verse } from '../types';

import './VerseOrderEditor.css';

const setDragEffect = (ev: React.DragEvent<HTMLDivElement>) => {
	ev.preventDefault();
	ev.dataTransfer.dropEffect = 'move';
	ev.dataTransfer.effectAllowed = 'move';
};

const setEventData = (i: number) => (e: React.DragEvent<HTMLDivElement>) => {
	e.dataTransfer.setData('text', i.toString());
};

interface VerseOrderEditorProps {
	currentSlideOrdering: number[];
	verses: Verse[];
	onChange: (ordering: number[]) => void;
}

export default class VerseOrderEditor extends React.Component<
	VerseOrderEditorProps
> {
	constructor(props: VerseOrderEditorProps) {
		super(props);

		this.handleDrop = this.handleDrop.bind(this);
	}

	public render() {
		return (
			<div className="order-editor-box">
				<div className="info">
					<h2>Verse order</h2>
				</div>
				<div className="order-editor">
					{this.props.verses.length > 0 ? (
						<div className="verse-names">
							{this.props.verses.map((v, i) => (
								<div
									key={i}
									onClick={this.addVerse(i)}
									className="order-verse-add"
								>
									+ {v.name}
								</div>
							))}
						</div>
					) : null}
					<div
						onDragOver={setDragEffect}
						className="order-verse-editor-dragndrop-box"
					>
						{this.props.verses.length === 0 ? (
							<em>No ordering specified</em>
						) : (
							this.props.currentSlideOrdering.map((id, i) => (
								<div
									draggable={true}
									key={i}
									onDragStart={setEventData(i)}
									onDrop={this.handleDrop}
									className="order-verse-editor-dragndrop-item"
									data-index={i}
								>
									<div className="order-verse-editor-dragndrop-text">
										{this.props.verses[id].name}
										<button
											onClick={this.getVerseRemover(i)}
											className="order-verse-editor-dragndrop-remove"
										>
											Remove
										</button>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		);
	}

	private addVerse(id: number) {
		return (() => {
			this.props.onChange(this.props.currentSlideOrdering.concat(id));
		}).bind(this);
	}

	private handleDrop(ev: React.DragEvent<HTMLDivElement>) {
		ev.preventDefault();

		const testIndex = ev.currentTarget.getAttribute('data-index');

		if (testIndex === null) {
			return;
		}

		const fromIndex = parseInt(ev.dataTransfer.getData('text'), 10);
		const toIndex = parseInt(testIndex, 10);

		const currentSlideOrdering = this.props.currentSlideOrdering.slice();

		const name = currentSlideOrdering.splice(fromIndex, 1)[0];

		currentSlideOrdering.splice(toIndex, 0, name);

		this.props.onChange(currentSlideOrdering);
	}

	private getVerseRemover(index: number) {
		const newList = this.props.currentSlideOrdering.slice();

		newList.splice(index, 1);

		return (() => {
			this.props.onChange(newList);
		}).bind(this);
	}
}
