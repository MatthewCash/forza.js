import fs from 'fs/promises';
import path from 'path';
import { EventEmitter } from 'stream';
import { Game, Telemetry } from './Game';
export default interface Forza {
    on(event: 'telemetry', listener: (telemetry: Telemetry) => void): this;
}

export default class Forza extends EventEmitter {
    private lastTelemetry: Telemetry;
    private games: Game[];
    constructor() {
        super();

        this.games = [];
    }
    async loadGames(filterGames?: string[]): Promise<void> {
        const gameDir = path.resolve(__dirname, './games/');

        const files = await fs.readdir(gameDir);
        let gameFiles = files.filter(file => file.endsWith('.json'));

        if (filterGames?.length) {
            gameFiles = gameFiles.filter(file =>
                filterGames.includes(file.split('.')[0])
            );
        }

        const gameLoadPromises = gameFiles.map(async gameFile => {
            const gameData = await import(path.resolve(gameDir, gameFile));

            const game = new Game(gameData);

            game.on('telemetry', telemetry => (this.lastTelemetry = telemetry));
            game.on('telemetry', this.emit.bind(this, 'telemetry'));

            this.games.push(game);
        });

        await Promise.all(gameLoadPromises);
    }
    startAllGameSockets(): void {
        if (!this.games.length) {
            return console.warn('No games loaded!');
        }

        this.games.forEach(game => game.startSocket());
    }
    getLatestTelemetry(): Telemetry {
        return this.lastTelemetry;
    }
}
