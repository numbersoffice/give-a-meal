export default function donationReceivedTemplate({
  businessName,
  donationName,
  donorProfileUrl,
}: {
  businessName: string;
  donationName: string;
  donorProfileUrl: string;
}) { 
  return {
    text: `Thank you for your donation!

We are happy to inform you that your ${donationName} has been successfully received!

It is now available for neighbors in need to pick up at ${businessName}. We will notify you once it has been claimed.

Once again, thank you! Give a Meal only works because of generous community members like you.

Warmest regards from ${businessName} and the entire Give a Meal Team

---

Donor Profile: ${donorProfileUrl}
Click the link above to add your name and track your giving.

Questions? Email us at ${process.env.INBOUND_EMAIL}.`,
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
        <td style="padding:0px 0px 8px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="font-size: 24px"><strong>Thank you for your donation!</strong></span></div>
<div style="font-family: inherit; text-align: inherit"><br></div><div></div></div></td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="37027d04-f575-4447-8853-cac9b2f17808" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:0px 0px 24px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: start"><span style="font-size: 16px; font-style: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; text-align: start; text-indent: 0px; text-transform: none; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-line: none; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; border-top-color: rgb(227, 227, 227); border-right-color: rgb(227, 227, 227); border-bottom-color: rgb(227, 227, 227); border-left-color: rgb(227, 227, 227); border-image-source: none; border-image-slice: 100%; border-image-width: 1; border-image-outset: 0; border-image-repeat: stretch; box-sizing: border-box; margin-top: 1.25em; margin-right: 0px; margin-bottom: 1.25em; margin-left: 0px; caret-color: rgb(13, 13, 13); color: #0d0d0d; font-family: Söhne, ui-sans-serif, system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, Ubuntu, Cantarell, &quot;Noto Sans&quot;, sans-serif, &quot;Helvetica Neue&quot;, Arial, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;">We are happy to inform you that your </span><span style="font-size: 16px; font-style: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; text-align: start; text-indent: 0px; text-transform: none; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-line: none; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; border-top-color: rgb(227, 227, 227); border-right-color: rgb(227, 227, 227); border-bottom-color: rgb(227, 227, 227); border-left-color: rgb(227, 227, 227); border-image-source: none; border-image-slice: 100%; border-image-width: 1; border-image-outset: 0; border-image-repeat: stretch; box-sizing: border-box; margin-top: 1.25em; margin-right: 0px; margin-bottom: 1.25em; margin-left: 0px; caret-color: rgb(13, 13, 13); color: #0d0d0d; font-family: Söhne, ui-sans-serif, system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, Ubuntu, Cantarell, &quot;Noto Sans&quot;, sans-serif, &quot;Helvetica Neue&quot;, Arial, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;"><strong>${donationName}</strong></span><span style="font-size: 16px; font-style: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; text-align: start; text-indent: 0px; text-transform: none; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-line: none; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; border-top-color: rgb(227, 227, 227); border-right-color: rgb(227, 227, 227); border-bottom-color: rgb(227, 227, 227); border-left-color: rgb(227, 227, 227); border-image-source: none; border-image-slice: 100%; border-image-width: 1; border-image-outset: 0; border-image-repeat: stretch; box-sizing: border-box; margin-top: 1.25em; margin-right: 0px; margin-bottom: 1.25em; margin-left: 0px; caret-color: rgb(13, 13, 13); color: #0d0d0d; font-family: Söhne, ui-sans-serif, system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, Ubuntu, Cantarell, &quot;Noto Sans&quot;, sans-serif, &quot;Helvetica Neue&quot;, Arial, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;"> has been successfully received!</span></div>
<div style="font-family: inherit; text-align: start"><br></div>
<div style="font-family: inherit; text-align: start"><span style="font-size: 16px; font-style: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; text-align: start; text-indent: 0px; text-transform: none; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-line: none; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; border-top-color: rgb(227, 227, 227); border-right-color: rgb(227, 227, 227); border-bottom-color: rgb(227, 227, 227); border-left-color: rgb(227, 227, 227); border-image-source: none; border-image-slice: 100%; border-image-width: 1; border-image-outset: 0; border-image-repeat: stretch; box-sizing: border-box; margin-top: 1.25em; margin-right: 0px; margin-bottom: 1.25em; margin-left: 0px; caret-color: rgb(13, 13, 13); color: #0d0d0d; font-family: Söhne, ui-sans-serif, system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, Ubuntu, Cantarell, &quot;Noto Sans&quot;, sans-serif, &quot;Helvetica Neue&quot;, Arial, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;">It is now available for neighbors in need to pick up at </span><span style="font-size: 16px; font-style: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; text-align: start; text-indent: 0px; text-transform: none; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-line: none; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; border-top-color: rgb(227, 227, 227); border-right-color: rgb(227, 227, 227); border-bottom-color: rgb(227, 227, 227); border-left-color: rgb(227, 227, 227); border-image-source: none; border-image-slice: 100%; border-image-width: 1; border-image-outset: 0; border-image-repeat: stretch; box-sizing: border-box; margin-top: 1.25em; margin-right: 0px; margin-bottom: 1.25em; margin-left: 0px; caret-color: rgb(13, 13, 13); color: #0d0d0d; font-family: Söhne, ui-sans-serif, system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, Ubuntu, Cantarell, &quot;Noto Sans&quot;, sans-serif, &quot;Helvetica Neue&quot;, Arial, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;"><strong>${businessName}</strong></span><span style="font-size: 16px; font-style: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; text-align: start; text-indent: 0px; text-transform: none; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-line: none; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; border-top-color: rgb(227, 227, 227); border-right-color: rgb(227, 227, 227); border-bottom-color: rgb(227, 227, 227); border-left-color: rgb(227, 227, 227); border-image-source: none; border-image-slice: 100%; border-image-width: 1; border-image-outset: 0; border-image-repeat: stretch; box-sizing: border-box; margin-top: 1.25em; margin-right: 0px; margin-bottom: 1.25em; margin-left: 0px; caret-color: rgb(13, 13, 13); color: #0d0d0d; font-family: Söhne, ui-sans-serif, system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, Ubuntu, Cantarell, &quot;Noto Sans&quot;, sans-serif, &quot;Helvetica Neue&quot;, Arial, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;">. We will notify you once it has been claimed.</span></div>
<div style="font-family: inherit; text-align: start"><br></div>
<div style="font-family: inherit; text-align: start"><span style="font-size: 16px; font-style: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; text-align: start; text-indent: 0px; text-transform: none; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-line: none; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; border-top-color: rgb(227, 227, 227); border-right-color: rgb(227, 227, 227); border-bottom-color: rgb(227, 227, 227); border-left-color: rgb(227, 227, 227); border-image-source: none; border-image-slice: 100%; border-image-width: 1; border-image-outset: 0; border-image-repeat: stretch; box-sizing: border-box; margin-top: 1.25em; margin-right: 0px; margin-bottom: 1.25em; margin-left: 0px; caret-color: rgb(13, 13, 13); color: #0d0d0d; font-family: Söhne, ui-sans-serif, system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, Ubuntu, Cantarell, &quot;Noto Sans&quot;, sans-serif, &quot;Helvetica Neue&quot;, Arial, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;">Once again, thank you! Give a Meal only works because of generous community members like you.</span></div>
<div style="font-family: inherit; text-align: start"><br></div>
<div style="font-family: inherit; text-align: start"><span style="font-size: 16px; font-style: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; text-align: start; text-indent: 0px; text-transform: none; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-line: none; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; border-top-color: rgb(227, 227, 227); border-right-color: rgb(227, 227, 227); border-bottom-color: rgb(227, 227, 227); border-left-color: rgb(227, 227, 227); border-image-source: none; border-image-slice: 100%; border-image-width: 1; border-image-outset: 0; border-image-repeat: stretch; box-sizing: border-box; margin-top: 1.25em; margin-right: 0px; margin-bottom: 1.25em; margin-left: 0px; caret-color: rgb(13, 13, 13); color: #0d0d0d; font-family: Söhne, ui-sans-serif, system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, Ubuntu, Cantarell, &quot;Noto Sans&quot;, sans-serif, &quot;Helvetica Neue&quot;, Arial, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;">Warmest regards from </span><span style="font-size: 16px; font-style: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; text-align: start; text-indent: 0px; text-transform: none; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-line: none; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; border-top-color: rgb(227, 227, 227); border-right-color: rgb(227, 227, 227); border-bottom-color: rgb(227, 227, 227); border-left-color: rgb(227, 227, 227); border-image-source: none; border-image-slice: 100%; border-image-width: 1; border-image-outset: 0; border-image-repeat: stretch; box-sizing: border-box; margin-top: 1.25em; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; caret-color: rgb(13, 13, 13); color: #0d0d0d; font-family: Söhne, ui-sans-serif, system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, Ubuntu, Cantarell, &quot;Noto Sans&quot;, sans-serif, &quot;Helvetica Neue&quot;, Arial, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;">${businessName} and the entire Give a Meal Team</span></div><div></div></div></td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="94b6e704-3a8b-48b6-a53a-4f47df1e8eef" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="border-top-left-radius: 12px; border-top-right-radius: 12px; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;; padding:24px 24px 24px 24px; line-height:22px; text-align:inherit; background-color:#3C7EF8;" height="100%" valign="top" bgcolor="#3C7EF8" role="module-content"><div><div style="font-family: inherit; text-align: inherit; class-name: rounded-box"><span style="box-sizing: border-box; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; font-style: inherit; font-variant-caps: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-family: inherit; font-size-adjust: inherit; font-kerning: inherit; font-variant-alternates: inherit; font-variant-ligatures: inherit; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-variant-position: inherit; font-feature-settings: inherit; font-optical-sizing: inherit; font-variation-settings: inherit; font-size: 16px; vertical-align: baseline; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: none; border-right-style: none; border-bottom-style: none; border-left-style: none; border-top-color: currentcolor; border-right-color: currentcolor; border-bottom-color: currentcolor; border-left-color: currentcolor; border-image-source: none; border-image-slice: 100%; border-image-width: 1; border-image-outset: 0; border-image-repeat: stretch; letter-spacing: normal; text-align: start; text-indent: 0px; text-transform: none; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-line: none; caret-color: rgb(13, 13, 13); color: #ffffff"><strong>Donor Profile</strong></span></div>
<div class="rounded-box" style="font-family: inherit; text-align: inherit; class-name: rounded-box"><a href=${donorProfileUrl}><span style="box-sizing: border-box; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; font-style: inherit; font-variant-caps: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-family: inherit; font-size-adjust: inherit; font-kerning: inherit; font-variant-alternates: inherit; font-variant-ligatures: inherit; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-variant-position: inherit; font-feature-settings: inherit; font-optical-sizing: inherit; font-variation-settings: inherit; font-size: 16px; vertical-align: baseline; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: none; border-right-style: none; border-bottom-style: none; border-left-style: none; border-top-color: currentcolor; border-right-color: currentcolor; border-bottom-color: currentcolor; border-left-color: currentcolor; border-image-source: none; border-image-slice: 100%; border-image-width: 1; border-image-outset: 0; border-image-repeat: stretch; letter-spacing: normal; text-align: start; text-indent: 0px; text-transform: none; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-line: none; caret-color: rgb(13, 13, 13); color: #ffffff"><u>Click here</u></span></a><span style="box-sizing: border-box; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; font-style: inherit; font-variant-caps: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-family: inherit; font-size-adjust: inherit; font-kerning: inherit; font-variant-alternates: inherit; font-variant-ligatures: inherit; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-variant-position: inherit; font-feature-settings: inherit; font-optical-sizing: inherit; font-variation-settings: inherit; font-size: 16px; vertical-align: baseline; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: none; border-right-style: none; border-bottom-style: none; border-left-style: none; border-top-color: currentcolor; border-right-color: currentcolor; border-bottom-color: currentcolor; border-left-color: currentcolor; border-image-source: none; border-image-slice: 100%; border-image-width: 1; border-image-outset: 0; border-image-repeat: stretch; letter-spacing: normal; text-align: start; text-indent: 0px; text-transform: none; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-line: none; caret-color: rgb(13, 13, 13); color: #ffffff"> to add your name and track your giving.</span></div><div></div></div></td>
      </tr>
    </tbody>
  </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="6c4cfffa-8e51-4f33-904d-389110914ebc" data-mc-module-version="2019-10-22">
    <tbody>
      <tr>
        <td style="padding:24px 0px 0px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="box-sizing: border-box; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; font-family: inherit; font-style: inherit; font-variant-caps: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-size: 14px; vertical-align: baseline; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: initial; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-top-color: initial; border-right-color: initial; border-bottom-color: initial; border-left-color: initial; border-image-source: initial; border-image-slice: initial; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; letter-spacing: normal; text-align: start; text-indent: 0px; text-transform: none; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-line: none; color: #7f7f86">Questions? Email us at </span><a href="" title="&lt;span data-offset-key=&quot;31t1v-1-0&quot; style=&quot;box-sizing: border-box; padding: 0px; margin: 0px; font-family: inherit; font-style: inherit; font-variant-caps: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-size: 14px; vertical-align: baseline; border: 0px;&quot;&gt;&lt;span data-text=&quot;true&quot; style=&quot;box-sizing: border-box; padding: 0px; margin: 0px; font-family: inherit; font-style: inherit; font-variant-caps: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-size: 14px; vertical-align: baseline; border: 0px;&quot;&gt;${process.env.INBOUND_EMAIL}&lt;/span&gt;&lt;/span&gt;"><span style="box-sizing: border-box; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; font-family: inherit; font-style: inherit; font-variant-caps: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-size: 14px; vertical-align: baseline; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: initial; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-top-color: initial; border-right-color: initial; border-bottom-color: initial; border-left-color: initial; border-image-source: initial; border-image-slice: initial; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; outline-color: initial; outline-style: none; outline-width: initial; color: #1188e6; text-decoration-line: none; transition-duration: 0.3s; transition-timing-function: ease; transition-delay: 0s; transition-property: color; letter-spacing: normal; text-align: start; text-indent: 0px; text-transform: none; word-spacing: 0px; -webkit-text-stroke-width: 0px">${process.env.INBOUND_EMAIL}</span></a><span style="box-sizing: border-box; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px; margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; font-family: inherit; font-style: inherit; font-variant-caps: inherit; font-weight: inherit; font-stretch: inherit; line-height: inherit; font-size: 14px; vertical-align: baseline; border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px; border-top-style: initial; border-right-style: initial; border-bottom-style: initial; border-left-style: initial; border-top-color: initial; border-right-color: initial; border-bottom-color: initial; border-left-color: initial; border-image-source: initial; border-image-slice: initial; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; letter-spacing: normal; text-align: start; text-indent: 0px; text-transform: none; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-line: none; color: #7f7f86">.</span></div><div></div></div></td>
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
