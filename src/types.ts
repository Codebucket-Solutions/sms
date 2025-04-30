export interface SendOptions {
    /** Recipients in E.164 format */
    to: string[];
    /** Message content for text/unicode/OTP */
    content?: string;
    /** Provider-side template/flow ID */
    templateId?: string;
    /** Variables to interpolate into content or template */
    variables?: Record<string, any>| string[];

    /** SMS type: text, template, bulk, unicode, otp, unicodeotp */
    type?: 'text' | 'template' | 'bulk' | 'unicode' | 'otp' | 'unicodeotp';
}

export interface ProviderConfig {
    /** Generic provider auth key */
    authKey?: string;
    /** Sender ID if applicable */
    senderId?: string;
}