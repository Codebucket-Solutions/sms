```
npm i @codebucket/sms
```

## SMS SERVER PROVIDER
```
const {SmsSender,SmsServerProvider} = require("@codebucket/sms");

let smsSender = new SmsSender(new SmsServerProvider(
    {
      smsServerUrl: process.env.SMS_SERVER_URL,
      senderId: process.env.SMS_SENDER_ID,
      accessToken: process.env.SMS_ACCESS_TOKEN
    }
));

await smsSender.send(
        {
            type: "template",
            to: [`91${mobile}`],
            templateId,
            variables: [variable],
        }
);
```

## MSG91 PROVIDER
```
const {SmsSender,Msg91Provider} = require("@codebucket/sms");
let smsSender = new SmsSender(new Msg91Provider(
    {
        authKey: process.env.MSG91_AUTH_KEY,
    }
));
await smsSender.send(
        {
            type: "template",
            to: [`91${mobile}`],
            templateId,
            variables: [variable],
        }
);
```

## MGOV PROVIDER
```
const {SmsSender,MgovProvider} = require("@codebucket/sms");
let smsSender = new SmsSender(new MgovProvider(
    {
        username: process.env.MGOV_USERNAME,
        password: process.env.MGOV_PASSWORD,
        senderId: process.env.MGOV_SENDER_ID,
        secureKey: process.env.MGOV_SECURE_KEY,
        url: process.env.MGOV_URL
    }
));

await smsSender.send(
        {
           type: "singlemsg",
           to: [`91${mobile}`],
           content: `BSCC College/University Registration: 
Kindly verify your mobile number using the given OTP: ${otp}. Education Department- Bihar Government.`,
        }
);
```