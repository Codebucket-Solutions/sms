import { SendOptions } from '../types';

/**
 * All SMS providers must implement a single send() method.
 */
export abstract class BaseProvider {
    /**
     * Handle all SMS send requests based on options.type and keys.
     */
    abstract send(opts: SendOptions): Promise<any>;
}