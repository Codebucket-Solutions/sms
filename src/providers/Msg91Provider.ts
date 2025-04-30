import axios from 'axios';
import { BaseProvider } from './BaseProvider';
import { SendOptions, ProviderConfig } from '../types';


interface Msg91Config extends ProviderConfig {
  senderId?: string;
  authKey: string;
  textUrl?: string;
  flowUrl?: string;
  route?: string;
  country?: string
}

export interface Msg91SendOptions extends SendOptions {
    shortUrl: string;
    shortUrlExpiry?: string;
    realTimeResponse?: string;
}


export class Msg91Provider extends BaseProvider {
    private textUrl: string;
    private flowUrl: string;

    constructor(private cfg: Msg91Config) {
        super();
        this.textUrl = cfg.textUrl || 'https://api.msg91.com/api/v2/sendsms';
        this.flowUrl = cfg.flowUrl || 'https://control.msg91.com/api/v5/flow';
    }

    async send(opts: Msg91SendOptions): Promise<any> {
        const { to, type = 'text', content = '', templateId, shortUrl, shortUrlExpiry, realTimeResponse} = opts;
        let {variables = [],} = opts;
        if(Array.isArray(variables)) {
            let tempVariables: any = {};
            for(let i = 0; i < variables.length; i++) {
                tempVariables[`var${i+1}`] = variables[i];
            }
            variables = tempVariables;
        }
        switch (type) {
            case 'template': {
                const recipients = to.map(num => ({ mobiles: num, ...variables }));
                let payload: any  = { template_id: templateId, recipients, short_url:0 };
                if(shortUrl)
                    payload = {...payload, short_url:shortUrl, }
                if(shortUrlExpiry)
                    payload = {...payload, short_url_expiry:shortUrlExpiry, }
                if(realTimeResponse)
                    payload = {...payload, realTimeResponse}
                const headers = { 'accept': 'application/json', 'content-type': 'application/json', 'authkey': this.cfg.authKey };
                return (await axios.post(this.flowUrl, payload, { headers })).data;
            }
            case 'text':
            case 'bulk':
            case 'otp':
            default: {
                const text = this.interpolate(content, variables);
                const smsArr = to.map(num => ({ message: text, to: [num] }));
                const payload = { sender: this.cfg.senderId, route: this.cfg.route, country: this.cfg.country, sms: smsArr };
                const headers = { 'accept': 'application/json', 'content-type': 'application/json', 'authkey': this.cfg.authKey };
                return (await axios.post(this.textUrl, payload, { headers })).data;
            }
        }
    }

    private interpolate(t: string, vars: Record<string, any>) {
        return t.replace(/{{(\w+)}}/g, (_, k) => vars[k] != null ? String(vars[k]) : '');
    }
}