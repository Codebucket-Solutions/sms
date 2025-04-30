import { BaseProvider } from './providers/BaseProvider';
import { SendOptions } from './types';

/**
 * SmsSender now takes any BaseProvider and delegates all send() calls.
 */
export class SmsSender<O extends SendOptions> {
    constructor(public provider: BaseProvider) {}

    send(opts: O): Promise<any> {
        return this.provider.send(opts);
    }
}