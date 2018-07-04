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

export const getFullVerses = (song: Song): Verse[] =>
	song.slideOrdering.map(index => song.verses[index]);

export const getCurrentSlideFromLinearIndex = (
	song: Song,
	index: number
): Slide => {
	const slides = getFullVerses(song)
		.map(v => v.slides)
		.reduce((a, b) => [...a, ...b]);

	if (index < 0 || index >= slides.length) {
		throw new Error('Index out of bounds');
	}

	return slides[index];
};

export const getSlideAfter = (song: Song, index: number): Slide | null => {
	const slides = getFullVerses(song)
		.map(v => v.slides)
		.reduce((a, b) => [...a, ...b]);

	if (index < 0 || index + 1 >= slides.length) {
		return null;
	}

	return slides[index + 1];
};

export const getVerseFromLinearIndex = (song: Song, index: number): Verse => {
	const verses = getFullVerses(song);

	let currentVerse: Verse;
	let testIndex = 0;
	while (index >= 0) {
		currentVerse = verses[testIndex++];
		index -= currentVerse.slides.length;
	}

	return currentVerse!;
};

export const getVerseIndexFromLinearIndex = (
	song: Song,
	index: number
): number => {
	const verses = getFullVerses(song);

	let currentIndex = -1;
	while (index >= 0) {
		index -= verses[++currentIndex].slides.length;
	}

	return currentIndex;
};

export const getSlideVerseIndexInFullSong = (
	song: Song,
	index: number
): number => {
	const verses = getFullVerses(song);

	let currentIndex = 0;
	let ret: number;

	while (index >= 0) {
		const currentVerse = verses[currentIndex++];
		if (index - currentVerse.slides.length < 0) {
			ret = index;
			break;
		} else {
			index -= currentVerse.slides.length;
		}
	}

	return ret!;
};

export const getSlideIndexForVerse = (song: Song, verseIndex: number) =>
	getFullVerses(song)
		.slice(0, verseIndex)
		.map(v => v.slides.length)
		.reduce((prev, curr) => prev + curr, 0);
