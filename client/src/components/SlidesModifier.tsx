import * as React from 'react';

import {
	convertFromRaw,
	convertToRaw,
	Editor,
	EditorState,
	RawDraftContentState
} from 'draft-js';

import { Slide } from '../types';

import 'draft-js/dist/Draft.css';
import './SlidesModifier.css';

const centerAlign = () => 'center-align';

const randomString = (count: number): string =>
	String.fromCharCode(97 + Math.round(Math.random() * 25)) +
	(count === 0 ? '' : randomString(count - 1));

const getRawFromText = (text: string): RawDraftContentState => ({
	blocks: text
		.split('\n')
		.map(line => ({
			depth: 0,
			entityRanges: [],
			inlineStyleRanges: [],
			key: randomString(6),
			text: line,
			type: 'unstyled' as 'unstyled'
		})),
	entityMap: {}
});

interface SlidesModifierProps {
	slides: Slide[];
	onChange: (slides: Slide[]) => void;
}

export default class SlidesModifier extends React.Component<
	SlidesModifierProps,
	{
		slides: Slide[];
		editorStates: EditorState[];
	}
> {
	public static getDerivedStateFromProps(
		props: SlidesModifierProps,
		state: {
			slides: Slide[];
			editorStates: EditorState[];
		}
	) {
		if (state.editorStates.length === props.slides.length) {
			return null;
		}

		return {
			editorStates: props.slides
				.map(v => v.text)
				.map(getRawFromText)
				.map(convertFromRaw)
				.map(s => EditorState.createWithContent(s)),
			// props.slides.length !== state.slides.length
			// ? state.editorStates.concat()
			// : state.editorStates,
			slides: props.slides
		};
	}
	public state = {
		editorStates: [] as EditorState[],
		slides: [] as Slide[]
	};
	private contentEditableRef = React.createRef<HTMLDivElement>();
	constructor(props: SlidesModifierProps) {
		super(props);

		this.addSlide = this.addSlide.bind(this);
		this.getSlideModifier = this.getSlideModifier.bind(this);
		this.getSlideRemover = this.getSlideRemover.bind(this);
	}
	public componentDidUpdate() {
		if (this.contentEditableRef.current !== null) {
			this.contentEditableRef.current.contentEditable = 'true';
		}
	}
	public render() {
		return (
			<div className="slides-modifier-box">
				{this.state.slides.map((v, i) => (
					<div key={i} className="slides-edit-slide">
						{/* <textarea
							onChange={this.getSlideModifier(i)}
							className="slides-slide-editor"
							value={v.text}
						/> */}
						<Editor
							editorState={this.state.editorStates[i]}
							onChange={this.getSlideModifier(i)}
							blockStyleFn={centerAlign}
						/>
						<button
							onClick={this.getSlideRemover(i)}
							className="slides-remove"
						>
							Remove slide
						</button>
					</div>
				))}
			</div>
		);
	}

	private addSlide() {
		const slides = this.state.slides.slice();
		const editorStates = this.state.editorStates.slice();

		slides.push({
			text: ''
		});
		editorStates.push(EditorState.createEmpty());

		// this.props.onChange(slides);

		this.setState({ slides, editorStates });
	}

	private getSlideModifier(index: number) {
		return ((editorState: EditorState) => {
			const slides = this.state.slides.slice();
			const editorStates = this.state.editorStates.slice();

			const raw = convertToRaw(editorState.getCurrentContent());

			slides[index] = {
				text: raw.blocks.map(b => b.text).join('\n')
			};
			editorStates[index] = editorState;

			this.setState({ slides, editorStates });

			this.props.onChange(slides);
		}).bind(this);
	}

	private getSlideRemover(index: number) {
		return (() => {
			const slides = this.state.slides.slice();
			const editorStates = this.state.editorStates.slice();

			slides.splice(index, 1);
			editorStates.splice(index, 1);

			this.setState({ slides, editorStates });

			this.props.onChange(slides);
		}).bind(this);
	}
}
