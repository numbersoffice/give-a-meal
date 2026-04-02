export default function donorThankYouTemplate({
  businessName,
  donationName,
  donorProfileUrl,
}: {
  businessName?: string;
  donationName?: string;
  donorProfileUrl: string;
}) {
  const hasDonationDetails = businessName && donationName;

  const textBody = hasDonationDetails
    ? `Thank you for your donation!

We wanted to reach out and say a heartfelt thank you for your ${donationName} at ${businessName}. Your generosity makes a real difference in the lives of our neighbors in need.

Give a Meal only works because of generous community members like you.

Warmest regards from ${businessName} and the entire Give a Meal Team

---

Donor Profile: ${donorProfileUrl}
Click the link above to track your giving and manage your profile.

Questions? Email us at ${process.env.INBOUND_EMAIL}.`
    : `Thank you for your donations!

We wanted to reach out and say a heartfelt thank you for your generous contributions. Your support makes a real difference in the lives of our neighbors in need.

Give a Meal only works because of generous community members like you.

Warmest regards from the entire Give a Meal Team

---

Donor Profile: ${donorProfileUrl}
Click the link above to track your giving and manage your profile.

Questions? Email us at ${process.env.INBOUND_EMAIL}.`;

  const headline = "Thank you for your donation!";

  const bodyParagraph = hasDonationDetails
    ? `We wanted to reach out and say a heartfelt thank you for your <strong>${donationName}</strong> at <strong>${businessName}</strong>. Your generosity makes a real difference in the lives of our neighbors in need.`
    : `We wanted to reach out and say a heartfelt thank you for your generous contributions. Your support makes a real difference in the lives of our neighbors in need.`;

  const signoff = hasDonationDetails
    ? `Warmest regards from ${businessName} and the entire Give a Meal Team`
    : `Warmest regards from the entire Give a Meal Team`;

  return {
    text: textBody,
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=Edge">
      <!--<![endif]-->
      <!--[if (gte mso 9)|(IE)]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
      <!--[if (gte mso 9)|(IE)]>
  <style type="text/css">
    body {width: 450px;margin: 0 auto;}
    table {border-collapse: collapse;}
    table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
    img {-ms-interpolation-mode: bicubic;}
  </style>
<![endif]-->
      <style type="text/css">
    body, p, div {
      font-family: arial,helvetica,sans-serif;
      font-size: 14px;
    }
    body {
      color: #000000;
    }
    body a {
      color: #1188E6;
      text-decoration: none;
    }
    p { margin: 0; padding: 0; }
    table.wrapper {
      width:100% !important;
      table-layout: fixed;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      -moz-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    img.max-width {
      max-width: 100% !important;
    }
    .column.of-2 {
      width: 50%;
    }
    .column.of-3 {
      width: 33.333%;
    }
    .column.of-4 {
      width: 25%;
    }
    ul ul ul ul  {
      list-style-type: disc !important;
    }
    ol ol {
      list-style-type: lower-roman !important;
    }
    ol ol ol {
      list-style-type: lower-latin !important;
    }
    ol ol ol ol {
      list-style-type: decimal !important;
    }
    @media screen and (max-width:480px) {
      .preheader .rightColumnContent,
      .footer .rightColumnContent {
        text-align: left !important;
      }
      .preheader .rightColumnContent div,
      .preheader .rightColumnContent span,
      .footer .rightColumnContent div,
      .footer .rightColumnContent span {
        text-align: left !important;
      }
      .preheader .rightColumnContent,
      .preheader .leftColumnContent {
        font-size: 80% !important;
        padding: 5px 0;
      }
      table.wrapper-mobile {
        width: 100% !important;
        table-layout: fixed;
      }
      img.max-width {
        height: auto !important;
        max-width: 100% !important;
      }
      a.bulletproof-button {
        display: block !important;
        width: auto !important;
        font-size: 80%;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .columns {
        width: 100% !important;
      }
      .column {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      .social-icon-column {
        display: inline-block !important;
      }
    }
  </style>
      <!--user entered Head Start--><!--End Head user entered-->
    </head>
    <body>
      <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#FFFFFF;">
        <div class="webkit">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
            <tr>
              <td valign="top" bgcolor="#FFFFFF" width="100%">
                <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="100%">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td>
                            <!--[if mso]>
    <center>
    <table><tr><td width="450">
  <![endif]-->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:450px;" align="center">
                                      <tr>
                                        <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
    <tr>
      <td role="module-content">
        <p></p>
      </td>
    </tr>
  </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="cac63cd4-b5fa-4931-98fc-75038d85e4cc">
    <tbody>
      <tr>
        <td style="font-size:6px; line-height:10px; padding:40px 0px 40px 0px;" valign="top" align="center">
          <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="150" alt="" data-proportionally-constrained="true" data-responsive="false" src="${process.env.NEXT_PUBLIC_BASE_URL}/assets/email/logo.png" height="22">
        </td>
      </tr>
    </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 30px 30px 30px;" bgcolor="#FFFFFF" data-distribution="1">
    <tbody>
      <tr role="module-content">
        <td height="100%" valign="top"><table width="390" style="width:390px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="" class="column column-0">
      <tbody>
        <tr>
          <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="103ca66b-6f69-42f3-8b44-19066bcc8881" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:0px 0px 8px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-size: 24px"><strong>${headline}</strong></span></div>
<div style="font-family: inherit; text-align: inherit"><br></div><div></div></div></td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="37027d04-f575-4447-8853-cac9b2f17808" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:0px 0px 24px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: start"><span style="font-size: 16px; color: #0d0d0d;">${bodyParagraph}</span></div>
<div style="font-family: inherit; text-align: start"><br></div>
<div style="font-family: inherit; text-align: start"><span style="font-size: 16px; color: #0d0d0d;">Give a Meal only works because of generous community members like you.</span></div>
<div style="font-family: inherit; text-align: start"><br></div>
<div style="font-family: inherit; text-align: start"><span style="font-size: 16px; color: #0d0d0d;">${signoff}</span></div><div></div></div></td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="94b6e704-3a8b-48b6-a53a-4f47df1e8eef" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="border-top-left-radius: 12px; border-top-right-radius: 12px; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;; padding:24px 24px 24px 24px; line-height:22px; text-align:inherit; background-color:#3C7EF8;" height="100%" valign="top" bgcolor="#3C7EF8" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-size: 16px; color: #ffffff"><strong>Donor Profile</strong></span></div>
<div style="font-family: inherit; text-align: inherit"><a href="${donorProfileUrl}"><span style="font-size: 16px; color: #ffffff"><u>Click here</u></span></a><span style="font-size: 16px; color: #ffffff"> to track your giving and manage your profile.</span></div><div></div></div></td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="6c4cfffa-8e51-4f33-904d-389110914ebc" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:24px 0px 0px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 14px; color: #7f7f86">Questions? Email us at </span><a href="mailto:${process.env.INBOUND_EMAIL}"><span style="font-size: 14px; color: #1188e6">${process.env.INBOUND_EMAIL}</span></a><span style="font-size: 14px; color: #7f7f86">.</span></div><div></div></div></td>
      </tr>
    </tbody>
  </table></td>
        </tr>
      </tbody>
    </table></td>
      </tr>
    </tbody>
  </table></td>
                                      </tr>
                                    </table>
                                    <!--[if mso]>
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <![endif]-->
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </center>
    </body>
  </html>`,
  };
}
