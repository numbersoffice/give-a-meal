import sgClient from "@sendgrid/client";
import sendGrid from "@sendgrid/mail";

sgClient.setApiKey(process.env.SENDGRID_KEY!);
sendGrid.setApiKey(process.env.SENDGRID_KEY!);

export { sgClient, sendGrid };
