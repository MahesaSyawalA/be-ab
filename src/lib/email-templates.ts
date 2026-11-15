export interface NewUserEmailData {
  nama: string;
  email: string;
  password: string;
  role?: string;
  loginUrl?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildNewUserHtml(data: NewUserEmailData): string {
  const safeNama = escapeHtml(data.nama);
  const safeEmail = escapeHtml(data.email);
  const safePassword = escapeHtml(data.password);
  const safeRole = data.role ? escapeHtml(data.role.replace(/_/g, " ").toUpperCase()) : "USER";
  const loginUrl = data.loginUrl || "https://ab-medical.vercel.app";

  return `<!--
* This email was built using Tabular.
* For more information, visit https://tabular.email
-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
<title>Detail Akun AB Medical</title>
<meta charset="UTF-8" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<!--[if !mso]><!---->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->
<meta name="x-apple-disable-message-reformatting" content="" />
<meta content="target-densitydpi=device-dpi" name="viewport" />
<meta content="true" name="HandheldFriendly" />
<meta content="width=device-width" name="viewport" />
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no" />
<style type="text/css">
table {
border-collapse: separate;
table-layout: fixed;
mso-table-lspace: 0pt;
mso-table-rspace: 0pt
}
table td {
border-collapse: collapse
}
.ExternalClass {
width: 100%
}
.ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
line-height: 100%
}
body, a, li, p, h1, h2, h3 {
-ms-text-size-adjust: 100%;
-webkit-text-size-adjust: 100%;
}
html {
-webkit-text-size-adjust: none !important
}
body {
min-width: 100%;
Margin: 0px;
padding: 0px;
}
body, #innerTable {
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale
}
#innerTable img+div {
display: none;
display: none !important
}
img {
Margin: 0;
padding: 0;
-ms-interpolation-mode: bicubic
}
h1, h2, h3, p, a {
overflow-wrap: normal;
white-space: normal;
word-break: break-word
}
a {
text-decoration: none
}
h1, h2, h3, p {
min-width: 100%!important;
width: 100%!important;
max-width: 100%!important;
display: inline-block!important;
border: 0;
padding: 0;
margin: 0
}
a[x-apple-data-detectors] {
color: inherit !important;
text-decoration: none !important;
font-size: inherit !important;
font-family: inherit !important;
font-weight: inherit !important;
line-height: inherit !important
}
u + #body a {
color: inherit;
text-decoration: none;
font-size: inherit;
font-family: inherit;
font-weight: inherit;
line-height: inherit;
}
a[href^="mailto"],
a[href^="tel"],
a[href^="sms"] {
color: inherit;
text-decoration: none
}
</style>
<style type="text/css">
@media (max-width: 480px) {
.hm { display: none!important }
}
</style>
<style type="text/css">
@media (max-width: 480px) {
.t46,.t52{mso-line-height-alt:0px!important;line-height:0!important;display:none!important}.t47{padding:30px 24px!important;border-radius:0!important}.t6{mso-line-height-alt:20px!important;line-height:20px!important}.t1{border:1px solid #ebebeb!important;border-radius:12px!important;overflow:hidden!important}.t23,.t25{max-width:398px!important}.t36{text-align:left!important}.t29{display:revert!important}.t31,.t35{vertical-align:top!important;width:auto!important;max-width:100%!important}
}
</style>
<!--[if !mso]><!---->
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&amp;family=Sofia+Sans:wght@700&amp;family=Open+Sans:wght@400;500;600&amp;display=swap" rel="stylesheet" type="text/css" />
<!--<![endif]-->
<!--[if mso]>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]-->
</head>
<body id="body" class="t55" style="min-width:100%;Margin:0px;padding:0px;background-color:#F4F6F9;"><div class="t54" style="background-color:#F4F6F9;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td class="t53" style="font-size:0;line-height:0;mso-line-height-rule:exactly;background-color:#F4F6F9;" valign="top" align="center">
<!--[if mso]>
<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false">
<v:fill color="#F4F6F9"/>
</v:background>
<![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center" id="innerTable"><tr><td><div class="t46" style="mso-line-height-rule:exactly;mso-line-height-alt:40px;line-height:40px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td class="t51" align="center">
<table class="t50" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="600" class="t49" style="width:600px;">
<table class="t48" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t47" style="border:1px solid #E2E8F0;overflow:hidden;background-color:#FFFFFF;padding:44px 42px 36px 42px;border-radius:8px 8px 8px 8px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100% !important;"><tr><td class="t5" align="left">
<table class="t4" role="presentation" cellpadding="0" cellspacing="0" style="Margin-right:auto;"><tr><td width="60" class="t3" style="width:60px;">
<table class="t2" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t1"><div style="font-size:0px;"><img class="t0" style="display:block;border:0;height:auto;width:100%;Margin:0;max-width:100%;border-radius:10px;" width="60" height="60" alt="AB Medical" src="https://cda7ac14-0427-4744-b77a-fa620a56604c.b-cdn.net/e/9e647369-4178-4fb6-ba38-9ef2b143b01e/66d23897-5a25-4327-b269-559bcd603baf.jpeg"/></div></td></tr></table>
</td></tr></table>
</td></tr><tr><td><div class="t6" style="mso-line-height-rule:exactly;mso-line-height-alt:32px;line-height:32px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td class="t12" align="center">
<table class="t11" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="514" class="t10" style="width:600px;">
<table class="t9" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t8" style="border-bottom:1px solid #EFF1F4;padding:0 0 18px 0;"><h1 class="t7" style="margin:0;Margin:0;font-family:Montserrat,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:28px;font-weight:700;font-style:normal;font-size:22px;text-decoration:none;text-transform:none;letter-spacing:-0.5px;direction:ltr;color:#0F172A;text-align:left;mso-line-height-rule:exactly;mso-text-raise:1px;">Selamat Datang di AB Medical</h1></td></tr></table>
</td></tr></table>
</td></tr><tr><td><div class="t13" style="mso-line-height-rule:exactly;mso-line-height-alt:18px;line-height:18px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td class="t19" align="center">
<table class="t18" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="514" class="t17" style="width:600px;">
<table class="t16" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t15">
<p class="t14" style="margin:0;Margin:0;font-family:Open Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:24px;font-weight:400;font-style:normal;font-size:15px;color:#334155;text-align:left;mso-line-height-rule:exactly;">
Halo <strong>${safeNama}</strong>,<br /><br />
Akun Anda di sistem <strong>AB Medical</strong> telah berhasil dibuat. Silakan gunakan informasi kredensial berikut untuk masuk ke sistem:
</p>

<!-- Credential Box -->
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;margin-top:18px;margin-bottom:18px;">
  <tr>
    <td style="padding:16px 20px;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;">
        <tr>
          <td style="font-family:Open Sans,sans-serif;font-size:14px;color:#64748B;padding:6px 0;width:110px;vertical-align:top;"><strong>Email</strong></td>
          <td style="font-family:Open Sans,sans-serif;font-size:14px;color:#0F172A;padding:6px 0;word-break:break-all;"><strong>${safeEmail}</strong></td>
        </tr>
        <tr>
          <td style="font-family:Open Sans,sans-serif;font-size:14px;color:#64748B;padding:6px 0;width:110px;vertical-align:top;"><strong>Password</strong></td>
          <td style="font-family:Open Sans,sans-serif;font-size:14px;color:#0F172A;padding:6px 0;"><code style="background-color:#E2E8F0;color:#0F172A;padding:3px 8px;border-radius:4px;font-size:14px;font-family:Consolas,monospace;letter-spacing:0.5px;">${safePassword}</code></td>
        </tr>
        <tr>
          <td style="font-family:Open Sans,sans-serif;font-size:14px;color:#64748B;padding:6px 0;width:110px;vertical-align:top;"><strong>Role</strong></td>
          <td style="font-family:Open Sans,sans-serif;font-size:14px;color:#0284C7;font-weight:600;padding:6px 0;">${safeRole}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<p style="margin:0;font-family:Open Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:22px;font-size:13px;color:#64748B;text-align:left;">
Demi keamanan, kami sangat menyarankan Anda untuk segera memperbarui password setelah berhasil melakukan login pertama kali.
</p>

</td></tr></table>
</td></tr></table>
</td></tr><tr><td><div class="t21" style="mso-line-height-rule:exactly;mso-line-height-alt:24px;line-height:24px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td class="t26" align="left">
<table class="t25" role="presentation" cellpadding="0" cellspacing="0" style="Margin-right:auto;max-width:514px;"><tr><td class="t24" style="width:auto;">
<table class="t23" role="presentation" cellpadding="0" cellspacing="0" style="width:auto;max-width:514px;"><tr><td class="t22" style="overflow:hidden;background-color:#0666EB;text-align:center;line-height:38px;mso-line-height-rule:exactly;mso-text-raise:5px;padding:0 28px;border-radius:40px;"><a href="${loginUrl}" target="_blank" style="text-decoration:none;display:inline-block;"><span class="t20" style="display:block;margin:0;Margin:0;font-family:Sofia Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:38px;font-weight:700;font-style:normal;font-size:16px;text-decoration:none;text-transform:none;letter-spacing:-0.2px;direction:ltr;color:#FFFFFF;text-align:center;mso-line-height-rule:exactly;mso-text-raise:5px;">Masuk ke Akun &rarr;</span></a></td></tr></table>
</td></tr></table>
</td></tr><tr><td><div class="t40" style="mso-line-height-rule:exactly;mso-line-height-alt:36px;line-height:36px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr><tr><td class="t45" align="center">
<table class="t44" role="presentation" cellpadding="0" cellspacing="0" style="Margin-left:auto;Margin-right:auto;"><tr><td width="514" class="t43" style="width:600px;">
<table class="t42" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="width:100%;"><tr><td class="t41" style="border-top:1px solid #DFE1E4;padding:24px 0 0 0;"><div class="t39" style="width:100%;text-align:left;"><div class="t38" style="display:inline-block;"><table class="t37" role="presentation" cellpadding="0" cellspacing="0" align="left" valign="top">
<tr class="t36"><td></td><td class="t31" valign="top">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t30" style="width:auto;"><tr><td class="t28" style="text-align:left;line-height:20px;mso-line-height-rule:exactly;"><span class="t27" style="display:block;margin:0;Margin:0;font-family:Open Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:20px;font-weight:600;font-style:normal;font-size:13px;color:#0F172A;text-align:left;">AB Medical System</span></td><td class="t29" style="width:20px;" width="20"></td></tr></table>
</td><td class="t35" valign="top">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="t34" style="width:auto;"><tr><td class="t33" style="text-align:left;line-height:20px;mso-line-height-rule:exactly;"><span class="t32" style="display:block;margin:0;Margin:0;font-family:Open Sans,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;line-height:20px;font-weight:400;font-style:normal;font-size:13px;color:#94A3B8;text-align:left;">Email ini dikirim otomatis oleh sistem &bull; Harap tidak membalas</span></td></tr></table>
</td>
<td></td></tr>
</table></div></div></td></tr></table>
</td></tr></table>
</td></tr></table></td></tr></table>
</td></tr></table>
</td></tr><tr><td><div class="t52" style="mso-line-height-rule:exactly;mso-line-height-alt:40px;line-height:40px;font-size:1px;display:block;">&nbsp;&nbsp;</div></td></tr></table></td></tr></table></div><div class="gmail-fix" style="display: none; white-space: nowrap; font: 15px courier; line-height: 0;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div></body>
</html>`;
}
