import axios from 'axios';
import { BaseProvider } from './BaseProvider';
import { SendOptions, ProviderConfig } from '../types';
import {Msg91SendOptions} from "./Msg91Provider";


interface SmsServerConfig extends ProviderConfig {
    smsServerUrl: string
    senderId: string
    accessToken: string
}

type SmsServerSendOptions = Msg91SendOptions | SendOptions


export class SmsServerProvider extends BaseProvider {

    constructor(private cfg: SmsServerConfig) {
        super();
    }

    async send(opts: SmsServerSendOptions): Promise<any> {
        const headers = { 'accept': 'application/json', 'content-type': 'application/json', 'Authorization': `Bearer ${this.cfg.accessToken}` };
        return await axios.post(this.cfg.smsServerUrl, {
            ...opts,
            senderId: this.cfg.senderId,
        }, { headers });
    }
}