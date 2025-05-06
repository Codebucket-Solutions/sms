// src/providers/SmartSolProvider.ts
import axios from 'axios';
import querystring from 'querystring';
import { BaseProvider } from './BaseProvider';
import { SendOptions, ProviderConfig } from '../types';

export interface SmartSolConfig  extends ProviderConfig {
    /** Your 100Coins API key */
    apiKey: string;
    /** 6-char mask (sender name) */
    mask: string;
    /** PE_ID as provided by SmartSol */
    peid: string;
    /** If true, use GET `/getsms`, otherwise POST `/postsms` */
    useGet?: boolean;
    /** If true, sends as flash SMS (`isflash=1`) */
    isFlash?: boolean;
}

function interpolate(template: string, vars: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
        vars[key] !== undefined ? String(vars[key]) : ''
    );
}

export class SmartSolProvider extends BaseProvider {
    private sendUrl: string;

    constructor(private cfg: SmartSolConfig) {
        super();
        this.sendUrl = cfg.useGet
            ? 'https://api.100coins.co/v3/getsms'
            : 'https://api.100coins.co/v3/postsms';
    }

    async send(opts: SendOptions): Promise<any> {
        const mtype = opts.type === 'unicode' ? 2 : 0;
        const mobno = opts.to.map(m => m.replace(/^91/, '')).join(',');

        let { variables} = opts;

        if(Array.isArray(variables)) {
            let tempVariables: any = {};
            for(let i = 0; i < variables.length; i++) {
                tempVariables[`var${i+1}`] = variables[i];
            }
            variables = tempVariables;
        }

        const params: Record<string, any> = {
            apikey: this.cfg.apiKey,
            mtype,
            mask: this.cfg.mask,
            mobno,
            peid: this.cfg.peid,
        };

        if (opts.templateId) {
            params.tempid = opts.templateId;
        }

        if (opts.content) {
            const msg = variables
                ? interpolate(opts.content, variables)
                : opts.content;
            params.message = msg;
        }

        if (this.cfg.isFlash) {
            params.isflash = 1;
        }

        if (this.cfg.useGet) {
            const resp = await axios.get(this.sendUrl, { params });
            return resp.data;
        } else {
            const resp = await axios.post(
                this.sendUrl,
                querystring.stringify(params),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );
            return resp.data;
        }
    }
}

