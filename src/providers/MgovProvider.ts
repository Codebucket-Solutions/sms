import axios from 'axios';
import { BaseProvider } from './BaseProvider';
import { SendOptions,ProviderConfig } from '../types';
import { createHash } from 'crypto';
import { stringify } from 'querystring';

interface MgovConfig extends ProviderConfig {
    username: string;
    /** Department login password */
    password: string;
    /** Secure key from portal */
    secureKey: string;
    /** Default DLT template ID */
    templateId?: string;
    /** Full gateway URL (optional) */
    url: string;
}

export class MgovProvider extends BaseProvider {
    constructor(private cfg: MgovConfig) { super(); }

    async send(opts: SendOptions): Promise<any> {
        const { to, content = '', type = 'text' } = opts;
        let { variables = [] } = opts;
        if(Array.isArray(variables)) {
            let tempVariables: any = {};
            for(let i = 0; i < variables.length; i++) {
                tempVariables[`var${i+1}`] = variables[i];
            }
            variables = tempVariables;
        }
        const msg = type === 'unicode' || type === 'unicodeotp'
            ? this.toUnicode(opts.content || '')
            : this.interpolate(opts.content || '', variables);
        const svcType = this.getServiceType(type);
        const key = this.sha512(this.cfg.username + this.cfg.senderId + msg + this.cfg.secureKey);
        const data: any = {
            senderid: this.cfg.senderId,
            content: msg,
            smsservicetype: svcType,
            username: this.cfg.username,
            password: this.sha1(this.cfg.password),
            key,
            templateid: opts.templateId || this.cfg.templateId
        };
        const field = svcType === 'bulkmsg' ? 'bulkmobno' : 'mobileno';
        data[field] = to.join(',');
        const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        return (await axios.post(this.cfg.url, stringify(data), { headers })).data;
    }

    private getServiceType(type: string): string {
        switch (type) {
            case 'bulk': return 'bulkmsg';
            case 'unicode': return 'unicodemsg';
            case 'otp': return 'otpmsg';
            case 'unicodeotp': return 'unicodeotpmsg';
            default: return 'singlemsg';
        }
    }

    private toUnicode(str: string): string {
        return str.split('').map(ch => `&#${ch.charCodeAt(0)};`).join('');
    }

    private interpolate(t: string, vars: Record<string, any>) {
        return t.replace(/{{(\w+)}}/g, (_, k) => vars[k] != null ? String(vars[k]) : '');
    }

    private sha1(d: string) { return createHash('sha1').update(d, 'utf8').digest('hex'); }
    private sha512(d: string) { return createHash('sha512').update(d, 'utf8').digest('hex'); }
}