import React from "react";
import Link from "next/link";
import styles from "@/styles/document.module.css";
import { Metadata } from "next";
import { Locale } from "@/i18n-config";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Our privacy notice.",
};

export default async function PrivacyNotice({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return (
    <>
      <div className="grid">
        <div className={styles.container}>
          <div className={styles.titleContainer}>
            <h2>Cookie Policy</h2>
            <p className="body_s">Last updated Jul 18, 2023</p>
          </div>

          <div className={styles.spacer} />

          <p className="body">
            This Cookie Policy explains how Fotura, Inc. (&quot;<b>Company</b>
            &quot;, &quot;
            <b>we</b>&quot;, &quot;<b>us</b>&quot;, and &quot;<b>our</b>&quot;)
            uses cookies and similar technologies to recognize you when you use
            our iOS or Android apps, or visit our website at{" "}
            <Link href="https://www.give-a-meal.org">
              https://www.give-a-meal.org
            </Link>{" "}
            (&quot;<b>Websites</b>&quot;). It explains what these technologies
            are and why we use them, as well as your rights to control our use
            of them.
          </p>
          <p className="body">
            In some cases we may use cookies to collect personal information, or
            that becomes personal information if we combine it with other
            information.
          </p>
          <h5>What are cookies?</h5>
          <p className="body">
            Cookies are small data files that are placed on your computer or
            mobile device when you visit a website. Cookies are widely used by
            website owners in order to make their websites work, or to work more
            efficiently, as well as to provide reporting information.
          </p>
          <p className="body">
            Cookies set by the website owner (in this case, Fotura, Inc.) are
            called &quot;first party cookies&quot;. Cookies set by parties other
            than the website owner are called &quot;third party cookies&quot;.
            Third party cookies enable third party features or functionality to
            be provided on or through the website (e.g. like advertising,
            interactive content and analytics). The parties that set these third
            party cookies can recognize your computer both when it visits the
            website in question and also when it visits certain other websites.
          </p>
          <h5>Why do we use cookies?</h5>
          <p className="body">
            We use first and third party cookies for several reasons. Some
            cookies are required for technical reasons in order for our Websites
            to operate, and we refer to these as &quot;essential&quot; or
            &quot;strictly necessary&quot; cookies. Other cookies also enable us
            to track and target the interests of our users to enhance the
            experience on our Online Properties. Third parties serve cookies
            through our Websites for advertising, analytics and other purposes.
            This is described in more detail below.
          </p>
          <p className="body">
            The specific types of first and third party cookies served through
            our Websites and the purposes they perform are described below
            (please note that the specific cookies served may vary depending on
            the specific Online Properties you visit):
          </p>
          <h5>How can I control cookies?</h5>
          <p className="body">
            You have the right to decide whether to accept or reject cookies.
            You can exercise your cookie rights by setting your preferences in
            the Cookie Consent Manager. The Cookie Consent Manager allows you to
            select which categories of cookies you accept or reject. Essential
            cookies cannot be rejected as they are strictly necessary to provide
            you with services.
          </p>
          <p className="body">
            The Cookie Consent Manager can be found in the notification banner
            and on our website. If you choose to reject cookies, you may still
            use our website though your access to some functionality and areas
            of our website may be restricted. You may also set or amend your web
            browser controls to accept or refuse cookies. As the means by which
            you can refuse cookies through your web browser controls vary from
            browser-to-browser, you should visit your browser&#39;s help menu
            for more information.
          </p>
          <p className="body">
            In addition, most advertising networks offer you a way to opt out of
            targeted advertising. If you would like to find out more
            information, please visit
            <Link href="http://www.aboutads.info/choices/">
              http://www.aboutads.info/choices/
            </Link>{" "}
            or
            <Link href="http://www.youronlinechoices.com">
              http://www.youronlinechoices.com
            </Link>
            .
          </p>
          <p className="body">
            The specific types of first and third party cookies served through
            our Websites and the purposes they perform are described in the
            table below (please note that the specific cookies served may vary
            depending on the specific Online Properties you visit):
          </p>
          <h5>
            <b>
              <u>Essential website cookies:</u>
            </b>
          </h5>
          <p className="body">
            These cookies are strictly necessary to provide you with services
            available through our Websites and to use some of its features, such
            as access to secure areas.
          </p>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Purpose</th>
                  <th>Provider</th>
                  <th>Service</th>
                  <th>Country</th>
                  <th>Type</th>
                  <th>Expires in</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>None</td>
                  <td>NA</td>
                  <td>NA</td>
                  <td>NA</td>
                  <td>NA</td>
                  <td>NA</td>
                  <td>NA</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h5>
            <b>
              <u>Non essential website cookies:</u>
            </b>
          </h5>
          <p className="body">
            These cookies are not strictly necessary to provide you with
            services available through our Websites but provide secondary
            functionality like analysing web traffic.
          </p>
          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Purpose</th>
                  <th>Provider</th>
                  <th>Service</th>
                  <th>Country</th>
                  <th>Type</th>
                  <th>Expires in</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>_ga</td>
                  <td>Used to distinguish users.</td>
                  <td>Google</td>
                  <td>Google Analytics</td>
                  <td>USA</td>
                  <td>HTTP cookie</td>
                  <td>2 years</td>
                </tr>
                <tr>
                  <td>_gid</td>
                  <td>Used to distinguish users.</td>
                  <td>Google</td>
                  <td>Google Analytics</td>
                  <td>USA</td>
                  <td>HTTP cookie</td>
                  <td>24 hours</td>
                </tr>
                <tr>
                  <td>_ga_[container-id]</td>
                  <td>Used to persist session state.</td>
                  <td>Google</td>
                  <td>Google Analytics</td>
                  <td>USA</td>
                  <td>HTTP cookie</td>
                  <td>2 years</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h5>What about other tracking technologies, like web beacons?</h5>
          <p className="body">
            Cookies are not the only way to recognize or track visitors to a
            website. We may use other, similar technologies from time to time,
            like web beacons (sometimes called &quot;tracking pixels&quot; or
            &quot;clear gifs&quot;). These are tiny graphics files that contain
            a unique identifier that enable us to recognize when someone has
            visited our Websites or opened an e-mail including them. This allows
            us, for example, to monitor the traffic patterns of users from one
            page within a website to another, to deliver or communicate with
            cookies, to understand whether you have come to the website from an
            online advertisement displayed on a third-party website, to improve
            site performance, and to measure the success of e-mail marketing
            campaigns. In many instances, these technologies are reliant on
            cookies to function properly, and so declining cookies will impair
            their functioning.
          </p>
          <h5>Do you use Flash cookies or Local Shared Objects?</h5>
          <p className="body">
            No, we do not use Flash cookies or Local Shared Objects.
          </p>
          <h5>Do you serve targeted advertising?</h5>
          <p className="body">No, we do not serve targeted advertising.</p>
          <h5>How often will you update this Cookie Policy?</h5>
          <p className="body">
            We may update this Cookie Policy from time to time in order to
            reflect, for example, changes to the cookies we use or for other
            operational, legal or regulatory reasons. Please therefore re-visit
            this Cookie Policy regularly to stay informed about our use of
            cookies and related technologies.
          </p>
          <p className="body">
            The date at the top of this Cookie Policy indicates when it was last
            updated.
          </p>
          <h5>Where can I get further information?</h5>
          <p className="body">
            If you have any questions about our use of cookies or other
            technologies, please email us at{" "}
            <Link href="benner@fotura.co">benner@fotura.co</Link> or by post to:
          </p>
          <p className="body">
            Fotura, Inc.
            <br />
            9450 SW Gemini Dr
            <br />
            Beaverton, OR 97008
            <br />
            United States
          </p>
        </div>
      </div>
      <Footer lang={lang} />
    </>
  );
}
