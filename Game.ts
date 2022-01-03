import dgram from 'dgram';
import { EventEmitter } from 'stream';
import { parseTelemetry } from './parseTelemetry';

export type Offsets = string[];

export interface Telemetry {
    game?: {
        id: Game['id'];
        name: Game['name'];
    };
    [key: string]: number | any;
}

export interface GameConstructor {
    id: string;
    name: string;
    socketPort: number;
    offsets: Offsets;
}

const activeTimeout = 5000;

export declare interface Game {
    on(event: 'telemetry', listener: (telemetry: Telemetry) => void): this;
}

export class Game extends EventEmitter {
    id: string;
    name: string;
    private socketPort: number;
    private offsets: Offsets;
    private socket: dgram.Socket;
    active: boolean;
    private activeTimer?: NodeJS.Timeout;

    constructor({ id, name, socketPort, offsets }: GameConstructor) {
        super();

        this.id = id;
        this.name = name;
        this.socketPort = socketPort;
        this.offsets = offsets;
        this.active = false;
    }

    startSocket() {
        this.socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
        this.socket.bind(this.socketPort, '0.0.0.0');

        this.socket.on('listening', this.onSocketListening.bind(this));
        this.socket.on('message', this.onSocketMessage.bind(this));
    }

    onSocketListening() {
        const address = this.socket.address();
        console.log(
            'UDP Server listening on ' + address.address + ':' + address.port
        );
    }

    onSocketMessage(raw: Buffer) {
        const telemetry = parseTelemetry(raw, this.offsets);
        telemetry.game = { id: this.id, name: this.name };

        this.emit('telemetry', telemetry);

        this.active = true;

        clearInterval(this.activeTimer);
        this.activeTimer = setTimeout(
            () => (this.active = false),
            activeTimeout
        );
    }
}
