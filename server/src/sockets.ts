import { existsSync, readdir, readFile, unlink, writeFileSync } from 'fs';
import { join } from 'path';
import * as io from 'socket.io';
import { promisify } from 'util';
import conf from './conf';
import { Song } from './types';

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

let currentIndex: number = 0;
let currentSong: Song = defaultSong;

export default (server: io.Server) => {
	const management = server.of('/management');
	const singers = server.of('/singers');
	const publicNsp = server.of('/');

	publicNsp.on('connection', socket => {
		socket.emit('load song and slide', { currentSong, currentIndex });
	});

	management.on('connection', socket => {
		socket.on('update slide', (index: number) => {
			currentIndex = index;
			singers.emit('update slide', index);
			publicNsp.emit('update slide', index);
		});

		socket.on('load song', (song: Song) => {
			currentSong = song;
			singers.emit('load song', song);
			publicNsp.emit('load song', song);
		});

		socket.on('update song contents', (song: Song, cback) => {
			currentSong = song;

			writeFileSync(
				join(conf.storageFolder, 'songs', `${song.name}.json`),
				JSON.stringify(song)
			);

			singers.emit('load song', song);
			publicNsp.emit('load song', song);

			cback();
		});

		socket.on('create song', (song: Song, cback) => {
			writeFileSync(
				join(conf.storageFolder, 'songs', `${song.name}.json`),
				JSON.stringify(song)
			);

			cback(0);
		});

		socket.on('get current song', cback => cback(currentSong));

		socket.on('get song', (name: string, cback) => {
			if (existsSync(join(conf.storageFolder, 'songs', `${name}.json`))) {
				readFile(
					join(conf.storageFolder, 'songs', `${name}.json`),
					(err, data) => {
						cback(data.toString());
					}
				);
			}
		});

		socket.on('get song list', cback => {
			readdir(join(conf.storageFolder, 'songs'), async (err, files) => {
				if (err) {
					throw err;
				}

				const read = promisify(readFile);

				cback(
					await Promise.all(
						files.map(f =>
							read(join(conf.storageFolder, 'songs', f), {encoding: 'utf-8'})
						)
					)
				);
			});
		});

		socket.on('delete song', (songName, cback) => {
			unlink(join(conf.storageFolder, 'songs', `${songName}.json`), err =>
				cback()
			);
		});
	});

	singers.on('connection', socket => {
		socket.emit('load song and slide', { currentSong, currentIndex });
	});
};
