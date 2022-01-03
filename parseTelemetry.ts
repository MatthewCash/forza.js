import { Offsets, Telemetry } from './Game';

const getBufferMethod = (
    buffer: Buffer,
    type: string
): [(offset: number) => number, number] => {
    switch (type) {
        case 's32':
            return [buffer.readInt32LE, 4];
        case 'u32':
            return [buffer.readUInt32LE, 4];
        case 'f32':
            return [buffer.readFloatLE, 4];
        case 'u16':
            return [buffer.readInt16LE, 2];
        case 'u8':
            return [buffer.readUInt8, 1];
        case 's8':
            return [buffer.readInt8, 1];
        default:
            return [buffer.readFloatLE, 4];
    }
};

export const parseTelemetry = (raw: Buffer, offsets: Offsets): Telemetry => {
    const telemetry = {};
    let offset = 0;

    const length = raw.byteLength;

    for (const datum in offsets) {
        if (offset > length - (length % 8)) break;

        const type = offsets[datum] as string;

        if (type.includes('skip')) {
            offset += Number(type.split('skip')[1]) / 8 ?? 4;
            continue;
        }

        const [bufferMethod, offsetDelta] = getBufferMethod(raw, type);

        telemetry[datum] = bufferMethod.bind(raw)(offset);

        offset += offsetDelta;
    }

    return telemetry;
};
