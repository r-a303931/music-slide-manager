export interface Song {
	verses: Verse[];
	name: string;
	slideOrdering: number[];
}

export interface Verse {
	slides: Slide[];
	name: string;
}

export interface Slide {
	text: string;
}

export const getCurrentSlideFromLinearIndex = (
	song: Song,
	index: number
): Slide => {
	const slides = song.verses
		.map(v => v.slides)
		.reduce((a, b) => [...a, ...b]);

	if (index < 0 || index > slides.length) {
		throw new Error('Index out of bounds');
	}

	return slides[index];
};

export const getSlideAfter = (song: Song, index: number): Slide => {
	const slides = song.verses
		.map(v => v.slides)
		.reduce((a, b) => [...a, ...b]);

	if (index < 0 || index + 1 > slides.length) {
		throw new Error('Index out of bounds');
	}

	return slides[index];
};
