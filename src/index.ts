import { App, LogLevel } from "@slack/bolt";
import { ChatPostMessageArguments } from "@slack/web-api";
import dotenv from "dotenv";
import * as middleware from "./customMiddleware";
import * as blocKit from "./block";

dotenv.config();

Object.keys(dotenv).forEach(key => {
  process.env[key] = dotenv[key];
});

// Initializes your app with your bot token and signing secret
const app = new App({
  logLevel: LogLevel.DEBUG,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// custom middleware's
app.use(middleware.notBotMessages);
app.use(middleware.noThreadMessages);
app.use(middleware.addUsersInfoContext);
app.use(middleware.getChannelInfo);

app.message(/^(.*)/ as any, async ({ context, message }) => {
  console.log(context.user);

  const msgOption: ChatPostMessageArguments = {
    token: process.env.SLACK_BOT_TOKEN,
    channel: process.env.CHANNEL_NAME,
    text: message.text,
    unfurl_links: true,
    link_names: true,
    unfurl_media: true,
    icon_url: context.profile.image_original,
    username: context.profile.display_name || context.profile.real_name,
    blocks: await blocKit.dealBlock({ message }),
  };

  console.log({msgOption})
  console.log(msgOption.blocks)

  await app.client.chat
    .postMessage(msgOption)
    .then(res => {
      if (res.ok) console.log(`msg: ok ✅`);
    })
    .catch(err => {
      console.error({ err });
    });
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
