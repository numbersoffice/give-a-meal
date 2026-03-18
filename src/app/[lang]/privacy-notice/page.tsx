import styles from "@/styles/document.module.css";
import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Locale } from "@/i18n-config";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy Notice",
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
            <h2>Privacy Notice</h2>
            <p className="body_s">Last updated Jul 18, 2023</p>
          </div>

          <div className={styles.spacer} />

          <p className="body">
            Thank you for choosing to be part of our community at Fotura, Inc.,
            doing business as Give A Meal (&quot;<b>Give A Meal</b>,&quot;
            &quot;
            <b>we</b>,&quot; &quot;
            <b>us</b>,&quot; or &quot;<b>our</b>&quot;). We are committed to
            protecting your personal information and your right to privacy. If
            you have any questions or concerns about this privacy notice or our
            practices with regard to your personal information, please contact
            us at <Link href="mailto:benner@fotura.co">benner@fotura.co</Link>.
          </p>
          <p className="body">
            This privacy notice describes how we might use your information if
            you:
          </p>

          <ul>
            <li>
              Visit our website at{" "}
              <Link href="https://www.give-a-meal.org">
                https://www.give-a-meal.org
              </Link>
            </li>
            <li>Use our iOS or Android app</li>
            <li>
              Engage with us in other related ways ― including any sales,
              marketing, or events
            </li>
            <p className="body">In this privacy notice, if we refer to:</p>
            <li>
              &quot;<b>Website</b>,&quot; we are referring to any website or app
              of ours that references or links to this policy
            </li>
            <li>
              &quot;<b>Services</b>,&quot; we are referring to our Website,
              app, and other related services, including any sales, marketing,
              or events
            </li>
          </ul>

          <p className="body">
            The purpose of this privacy notice is to explain to you in the
            clearest way possible what information we collect, how we use it,
            and what rights you have in relation to it. If there are any terms
            in this privacy notice that you do not agree with, please
            discontinue use of our Services immediately.
          </p>
          <p className="body">
            <b>
              Please read this privacy notice carefully, as it will help you
              understand what we do with the information that we collect.
            </b>
          </p>

          <h3>Table of contents</h3>
          <ol>
            <li>
              <Link href="#1">What information do we collect?</Link>
            </li>
            <li>
              <Link href="#2">How do we use your information?</Link>
            </li>
            <li>
              <Link href="#3">
                Will your information be shared with anyone?
              </Link>
            </li>
            <li>
              <Link href="#4">
                Do we use cookies and other tracking technologies?
              </Link>
            </li>
            <li>
              <Link href="#5">How long do we keep your information?</Link>
            </li>
            <li>
              <Link href="#6">How do we keep your information safe?</Link>
            </li>
            <li>
              <Link href="#7">What are your privacy rights?</Link>
            </li>
            <li>
              <Link href="#8">Controls for do-not-track features</Link>
            </li>
            <li>
              <Link href="#9">
                Do California residents have specific privacy rights?
              </Link>
            </li>
            <li>
              <Link href="#10">Do we make updates to this notice?</Link>
            </li>
            <li>
              <Link href="#11">How can you contact us about this notice?</Link>
            </li>
          </ol>

          <h3 id="1">1. What information fo we collect?</h3>
          <h5>Information automatically collected</h5>
          <p className="body">
            <b>In Short:</b> Some information — such as your Internet Protocol
            (IP) address and/or browser and device characteristics — is
            collected automatically when you visit our Website.
          </p>
          <p className="body">
            We automatically collect certain information when you visit, use or
            navigate the Website. This information does not reveal your specific
            identity (like your name or contact information) but may include
            device and usage information, such as your IP address, browser and
            device characteristics, operating system, language preferences,
            referring URLs, device name, country, location, information about
            how and when you use our Website and other technical information.
            This information is primarily needed to maintain the security and
            operation of our Website, and for our internal analytics and
            reporting purposes.
          </p>
          <p className="body">
            Like many businesses, we also collect information through cookies
            and similar technologies.
          </p>
          <p className="body">The information we collect includes:</p>
          <ul>
            <li>
              <i>Log and Usage Data.</i> Log and usage data is service-related,
              diagnostic, usage and performance information our servers
              automatically collect when you access or use our Website and which
              we record in log files. Depending on how you interact with us,
              this log data may include your IP address, device information,
              browser type and settings and information about your activity in
              the Website (such as the date/time stamps associated with your
              usage, pages and files viewed, searches and other actions you take
              such as which features you use), device event information (such as
              system activity, error reports (sometimes called &quot;crash
              dumps&quot;) and hardware settings).
            </li>
            <li>
              <i>Device Data.</i> We collect device data such as information
              about your computer, phone, tablet or other device you use to
              access the Website. Depending on the device used, this device data
              may include information such as your IP address (or proxy server),
              device and application identification numbers, location, browser
              type, hardware model Internet service provider and/or mobile
              carrier, operating system and system configuration information.
            </li>
            <li>
              <i>Location Data.</i> We collect location data such as information
              about your device&#39;s location, which can be either precise or
              imprecise. How much information we collect depends on the type and
              settings of the device you use to access the Website. For example,
              we may use GPS and other technologies to collect geolocation data
              that tells us your current location (based on your IP address).
              You can opt out of allowing us to collect this information either
              by refusing access to the information or by disabling your
              Location setting on your device. Note however, if you choose to
              opt out, you may not be able to use certain aspects of the
              Services.
            </li>
          </ul>

          <h3 id="2">2. How do we use your information?</h3>
          <p className="body">
            <b>In Short:</b>  We process your information for purposes based on
            legitimate business interests, the fulfillment of our contract with
            you, compliance with our legal obligations, and/or your consent.
          </p>
          <p className="body">
            We use personal information collected via our Website for a variety
            of business purposes described below. We process your personal
            information for these purposes in reliance on our legitimate
            business interests, in order to enter into or perform a contract
            with you, with your consent, and/or for compliance with our legal
            obligations. We indicate the specific processing grounds we rely on
            next to each purpose listed below.
          </p>
          <p className="body">We use the information we collect or receive:</p>
          <ul>
            <li>
              <b>To facilitate account creation and logon process.</b> If you
              choose to link your account with us to a third-party account (such
              as your Google or Facebook account), we use the information you
              allowed us to collect from those third parties to facilitate
              account creation and logon process for the performance of the
              contract.
            </li>
            <li>
              <b>Request feedback.</b> We may use your information to request
              feedback and to contact you about your use of our Website.
            </li>
            <li>
              <b>To manage user accounts.</b> We may use your information for
              the purposes of managing our account and keeping it in working
              order.
            </li>
            <li>
              <b>To send administrative information to you.</b> We may use your
              personal information to send you product, service and new feature
              information and/or information about changes to our terms,
              conditions, and policies.
            </li>
            <li>
              <b>To protect our Services.</b> We may use your information as
              part of our efforts to keep our Website safe and secure (for
              example, for fraud monitoring and prevention).
            </li>
            <li>
              <b>
                To enforce our terms, conditions and policies for business
                purposes, to comply with legal and regulatory requirements or in
                connection with our contract.
              </b>
            </li>
            <li>
              <b>To respond to legal requests and prevent harm.</b> If we
              receive a subpoena or other legal request, we may need to inspect
              the data we hold to determine how to respond.
            </li>
            <li>
              <b>Fulfill and manage your orders.</b> We may use your information
              to fulfill and manage your orders, payments, returns, and
              exchanges made through the Website.
            </li>
            <li>
              <b>To deliver and facilitate delivery of services to the user.</b>{" "}
              We may use your information to provide you with the requested
              service.
            </li>
            <li>
              <b>To respond to user inquiries/offer support to users.</b> We may
              use your information to respond to your inquiries and solve any
              potential issues you might have with the use of our Services.
            </li>
          </ul>

          <h3 id="3">3. Will your information be shared with anyone?</h3>
          <p className="body">
            <b>In Short:</b>  We only share information with your consent, to
            comply with laws, to provide you with services, to protect your
            rights, or to fulfill business obligations.
          </p>
          <p className="body">
            We may process or share your data that we hold based on the
            following legal basis:
          </p>
          <ul>
            <li>
              <b>Consent:</b> We may process your data if you have given us
              specific consent to use your personal information for a specific
              purpose.
            </li>
            <li>
              <b>Legitimate Interests:</b> We may process your data when it is
              reasonably necessary to achieve our legitimate business interests.
            </li>
            <li>
              <b>Performance of a Contract:</b> Where we have entered into a
              contract with you, we may process your personal information to
              fulfill the terms of our contract.
            </li>
            <li>
              <b>Legal Obligations:</b> We may disclose your information where
              we are legally required to do so in order to comply with
              applicable law, governmental requests, a judicial proceeding,
              court order, or legal process, such as in response to a court
              order or a subpoena (including in response to public authorities
              to meet national security or law enforcement requirements).
            </li>
            <li>
              <b>Vital Interests:</b> We may disclose your information where we
              believe it is necessary to investigate, prevent, or take action
              regarding potential violations of our policies, suspected fraud,
              situations involving potential threats to the safety of any person
              and illegal activities, or as evidence in litigation in which we
              are involved.
            </li>
          </ul>

          <p className="body">
            More specifically, we may need to process your data or share your
            personal information in the following situations:
          </p>
          <ul>
            <li>
              <b>Business Transfers.</b> We may share or transfer your
              information in connection with, or during negotiations of, any
              merger, sale of company assets, financing, or acquisition of all
              or a portion of our business to another company.
            </li>
            <li>
              <b>Google Maps Platform APIs.</b> We may share your information
              with certain Google Maps Platform APIs (e.g., Google Maps API,
              Place API). To find out more about Google’s Privacy Policy, please
              refer to this 
              <Link href="https://policies.google.com/privacy">link</Link>. We
              obtain and store on your device (&quot;cache&quot;) your location.
              You may revoke your consent anytime by contacting us at the
              contact details provided at the end of this document.
            </li>
            <li>
              <b>Expo.</b> We may share your information with certain Expo
              services if given explicit consent by you. To find out more about
              Expo’s Privacy Policy, please refer to this{" "}
              <Link href="https://expo.dev/privacy">link</Link>.
            </li>
          </ul>

          <h3 id="4">4. Do we use cookies and other tracking technologies?</h3>
          <p className="body">
            <b>In Short:</b> We may use cookies and other tracking technologies
            to collect and store your information.
          </p>
          <p className="body">
            We may use cookies and similar tracking technologies (like web
            beacons and pixels) to access or store information. Specific
            information about how we use such technologies and how you can
            refuse certain cookies is set out in our{" "}
            <Link href="./cookie-policy">Cookie Notice</Link>.
          </p>

          <h3 id="5">5. How long do we keep your information?</h3>
          <p className="body">
            <b>In Short:</b> We keep your information for as long as necessary
            to fulfill the purposes outlined in this privacy notice unless
            otherwise required by law.
          </p>
          <p className="body">
            We will only keep your personal information for as long as it is
            necessary for the purposes set out in this privacy notice, unless a
            longer retention period is required or permitted by law (such as
            tax, accounting or other legal requirements). No purpose in this
            notice will require us keeping your personal information for longer
            than the period of time in which users have an account with us.
          </p>
          <p className="body">
            When we have no ongoing legitimate business need to process your
            personal information, we will either delete or anonymize such
            information, or, if this is not possible (for example, because your
            personal information has been stored in backup archives), then we
            will securely store your personal information and isolate it from
            any further processing until deletion is possible.
          </p>

          <h3 id="6">6. How do we keep your information safe?</h3>
          <p className="body">
            <b>In Short:</b> We aim to protect your personal information through
            a system of organizational and technical security measures.
          </p>
          <p className="body">
            We have implemented appropriate technical and organizational
            security measures designed to protect the security of any personal
            information we process. However, despite our safeguards and efforts
            to secure your information, no electronic transmission over the
            Internet or information storage technology can be guaranteed to be
            100% secure, so we cannot promise or guarantee that hackers,
            cybercriminals, or other unauthorized third parties will not be able
            to defeat our security, and improperly collect, access, steal, or
            modify your information. Although we will do our best to protect
            your personal information, transmission of personal information to
            and from our Website is at your own risk. You should only access the
            Website within a secure environment.
          </p>

          <h3 id="7">7. What are your privacy rights?</h3>
          <p className="body">
            <b>In Short:</b> You may review, change, or terminate your account
            at any time.
          </p>
          <p className="body">
            If you are a resident in the EEA or UK and you believe we are
            unlawfully processing your personal information, you also have the
            right to complain to your local data protection supervisory
            authority. You can find their contact details{" "}
            <Link href="https://ec.europa.eu/justice/data-protection/bodies/authorities/index_en.htm">
              here
            </Link>
            .
          </p>
          <p className="body">
            If you are a resident in Switzerland, the contact details for the
            data protection authorities are available{" "}
            <Link href="https://www.edoeb.admin.ch/edoeb/en/home.html">
              here
            </Link>
            .
          </p>
          <p className="body">
            If you have questions or comments about your privacy rights, you may
            email us at{" "}
            <Link href="mailto:benner@fotura.co">benner@fotura.co</Link>.
          </p>
          <h5>Account Information</h5>
          <p className="body">
            If you would at any time like to review or change the information in
            your account or terminate your account, you can contact us using the
            contact information provided.
          </p>
          <p className="body">
            Upon your request to terminate your account, we will deactivate or
            delete your account and information from our active databases.
            However, we may retain some information in our files to prevent
            fraud, troubleshoot problems, assist with any investigations,
            enforce our Terms of Use and/or comply with applicable legal
            requirements.
          </p>
          <p className="body">
            <b>Cookies and similar technologies:</b> Most Web browsers are set
            to accept cookies by default. If you prefer, you can usually choose
            to set your browser to remove cookies and to reject cookies. If you
            choose to remove cookies or reject cookies, this could affect
            certain features or services of our Website.
          </p>
          <p className="body">
            <b>Opting out of email marketing:</b> You can unsubscribe from our
            marketing email list at any time by clicking on the unsubscribe link
            in the emails that we send or by contacting us using the details
            provided below. You will then be removed from the marketing email
            list — however, we may still communicate with you, for example to
            send you service-related emails that are necessary for the
            administration and use of your account, to respond to service
            requests, or for other non-marketing purposes. To otherwise opt-out,
            you may contact us using the contact information provided.
          </p>

          <h3 id="8">8. Controls for do-not-track features</h3>
          <p className="body">
            Most web browsers and some mobile operating systems and mobile
            applications include a Do-Not-Track (&quot;DNT&quot;) feature or
            setting you can activate to signal your privacy preference not to
            have data about your online browsing activities monitored and
            collected. At this stage no uniform technology standard for
            recognizing and implementing DNT signals has been finalized. As
            such, we do not currently respond to DNT browser signals or any
            other mechanism that automatically communicates your choice not to
            be tracked online. If a standard for online tracking is adopted that
            we must follow in the future, we will inform you about that practice
            in a revised version of this privacy notice.
          </p>

          <h3 id="9">
            9. Do California residents have specific privacy rights?
          </h3>
          <p className="body">
            <b>In Short:</b> Yes, if you are a resident of California, you are
            granted specific rights regarding access to your personal
            information.
          </p>
          <p className="body">
            California Civil Code Section 1798.83, also known as the &quot;Shine
            The Light&quot; law, permits our users who are California residents
            to request and obtain from us, once a year and free of charge,
            information about categories of personal information (if any) we
            disclosed to third parties for direct marketing purposes and the
            names and addresses of all third parties with which we shared
            personal information in the immediately preceding calendar year. If
            you are a California resident and would like to make such a request,
            please submit your request in writing to us using the contact
            information provided below.
          </p>
          <p className="body">
            If you are under 18 years of age, reside in California, and have a
            registered account with the Website, you have the right to request
            removal of unwanted data that you publicly post on the Website. To
            request removal of such data, please contact us using the contact
            information provided below, and include the email address associated
            with your account and a statement that you reside in California. We
            will make sure the data is not publicly displayed on the Website,
            but please be aware that the data may not be completely or
            comprehensively removed from all our systems (e.g. backups, etc.).
          </p>
          <h5>CCPA Privacy Notice</h5>
          <p className="body">
            The California Code of Regulations defines a &quot;resident&quot;
            as:
          </p>
          <p className="body">
            (1) every individual who is in the State of California for other
            than a temporary or transitory purpose and
            <br />
            (2) every individual who is domiciled in the State of California who
            is outside the State of California for a temporary or transitory
            purpose
          </p>
          <p className="body">
            All other individuals are defined as &quot;non-residents.&quot;
          </p>
          <p className="body">
            If this definition of &quot;resident&quot; applies to you, we must
            adhere to certain rights and obligations regarding your personal
            information.
          </p>
          <p className="body">
            <b>What categories of personal information do we collect?</b>
          </p>
          <p className="body">
            We have collected the following categories of personal information
            in the past twelve (12) months:
          </p>

          <div className={styles.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Examples</th>
                  <th>Collected</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>A. Identifiers</td>
                  <td>
                    Contact details, such as real name, alias, postal address,
                    telephone or mobile contact number, unique personal
                    identifier, online identifier, Internet Protocol address,
                    email address and account name
                  </td>
                  <td>YES</td>
                </tr>
                <tr>
                  <td>
                    B. Personal information categories listed in the California
                    Customer Records statute
                  </td>
                  <td>
                    Name, contact information, education, employment, employment
                    history and financial information
                  </td>
                  <td>YES</td>
                </tr>
                <tr>
                  <td>
                    C. Protected classification characteristics under California
                    or federal law
                  </td>
                  <td>Gender and date of birth</td>
                  <td>NO</td>
                </tr>
                <tr>
                  <td>D. Commercial information</td>
                  <td>
                    Transaction information, purchase history, financial details
                    and payment information
                  </td>
                  <td>NO</td>
                </tr>
                <tr>
                  <td>E. Biometric information</td>
                  <td>Fingerprints and voiceprints</td>
                  <td>NO</td>
                </tr>
                <tr>
                  <td>F. Internet or other similar network activity</td>
                  <td>
                    Browsing history, search history, online behavior, interest
                    data, and interactions with our and other websites,
                    applications, systems and advertisements
                  </td>
                  <td>NO</td>
                </tr>
                <tr>
                  <td>G. Geolocation data</td>
                  <td>Device location</td>
                  <td>YES</td>
                </tr>
                <tr>
                  <td>
                    H. Audio, electronic, visual, thermal, olfactory, or similar
                    information
                  </td>
                  <td>
                    Images and audio, video or call recordings created in
                    connection with our business activities
                  </td>
                  <td>NO</td>
                </tr>
                <tr>
                  <td>I. Professional or employment-related information</td>
                  <td>
                    Business contact details in order to provide you our
                    services at a business level, job title as well as work
                    history and professional qualifications if you apply for a
                    job with us
                  </td>
                  <td>NO</td>
                </tr>
                <tr>
                  <td>J. Education Information</td>
                  <td>Student records and directory information</td>
                  <td>NO</td>
                </tr>
                <tr>
                  <td>K. Inferences drawn from other personal information</td>
                  <td>
                    Inferences drawn from any of the collected personal
                    information listed above to create a profile or summary
                    about, for example, an individual’s preferences and
                    characteristics
                  </td>
                  <td>NO</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="body">
            We may also collect other personal information outside of these
            categories instances where you interact with us in-person, online,
            or by phone or mail in the context of:
          </p>
          <li>Receiving help through our customer support channels;</li>
          <li>Participation in customer surveys or contests; and</li>
          <li>
            Facilitation in the delivery of our Services and to respond to your
            inquiries.
          </li>
          <p className="body">
            <b>How do we use and share your personal information?</b>
          </p>
          <p className="body">
            More information about our data collection and sharing practices can
            be found in this privacy notice.
          </p>
          <p className="body">
            You may contact us by email at{" "}
            <Link href="mailto:benner@fotura.co">benner@fotura.co</Link>, or by
            referring to the contact details at the bottom of this document.
          </p>
          <p className="body">
            If you are using an authorized agent to exercise your right to
            opt-out we may deny a request if the authorized agent does not
            submit proof that they have been validly authorized to act on your
            behalf.
          </p>
          <p className="body">
            <b>Will your information be shared with anyone else?</b>
          </p>
          <p className="body">
            We may disclose your personal information with our service providers
            pursuant to a written contract between us and each service provider.
            Each service provider is a for-profit entity that processes the
            information on our behalf.
          </p>
          <p className="body">
            We may use your personal information for our own business purposes,
            such as for undertaking internal research for technological
            development and demonstration. This is not considered to be
            &quot;selling&quot; of your personal data.
          </p>
          <p className="body">
            Fotura, Inc. has not disclosed or sold any personal information to
            third parties for a business or commercial purpose in the preceding
            12 months. Fotura, Inc. will not sell personal information in the
            future belonging to website visitors, users and other consumers.
          </p>
          <p className="body">
            <b>Your rights with respect to your personal data</b>
          </p>
          <p className="body">
            <u>Right to request deletion of the data - Request to delete</u>
          </p>
          <p className="body">
            You can ask for the deletion of your personal information. If you
            ask us to delete your personal information, we will respect your
            request and delete your personal information, subject to certain
            exceptions provided by law, such as (but not limited to) the
            exercise by another consumer of his or her right to free speech, our
            compliance requirements resulting from a legal obligation or any
            processing that may be required to protect against illegal
            activities.
          </p>
          <p className="body">
            <u>Right to be informed - Request to know</u>
          </p>
          <p className="body">
            Depending on the circumstances, you have a right to know:
          </p>
          <ul>
            <li>whether we collect and use your personal information;</li>
            <li>the categories of personal information that we collect;</li>
            <li>
              the purposes for which the collected personal information is used;
            </li>
            <li>whether we sell your personal information to third parties;</li>
            <li>
              the categories of personal information that we sold or disclosed
              for a business purpose;
            </li>
            <li>
              the categories of third parties to whom the personal information
              was sold or disclosed for a business purpose; and
            </li>
            <li>
              the business or commercial purpose for collecting or selling
              personal information.
            </li>
          </ul>
          <p className="body">
            In accordance with applicable law, we are not obligated to provide
            or delete consumer information that is de-identified in response to
            a consumer request or to re-identify individual data to verify a
            consumer request.
          </p>
          <p className="body">
            <u>
              Right to Non-Discrimination for the Exercise of a Consumer’s
              Privacy Rights
            </u>
          </p>
          <p className="body">
            We will not discriminate against you if you exercise your privacy
            rights.
          </p>
          <p className="body">
            <u>Verification process</u>
          </p>
          <p className="body">
            Upon receiving your request, we will need to verify your identity to
            determine you are the same person about whom we have the information
            in our system. These verification efforts require us to ask you to
            provide information so that we can match it with information you
            have previously provided us. For instance, depending on the type of
            request you submit, we may ask you to provide certain information so
            that we can match the information you provide with the information
            we already have on file, or we may contact you through a
            communication method (e.g. phone or email) that you have previously
            provided to us. We may also use other verification methods as the
            circumstances dictate.
          </p>
          <p className="body">
            We will only use personal information provided in your request to
            verify your identity or authority to make the request. To the extent
            possible, we will avoid requesting additional information from you
            for the purposes of verification. If, however, we cannot verify your
            identity from the information already maintained by us, we may
            request that you provide additional information for the purposes of
            verifying your identity, and for security or fraud-prevention
            purposes. We will delete such additionally provided information as
            soon as we finish verifying you.
          </p>
          <p className="body">
            <u>Other privacy rights</u>
          </p>
          <li>you may object to the processing of your personal data</li>
          <li>
            you may request correction of your personal data if it is incorrect
            or no longer relevant, or ask to restrict the processing of the data
          </li>
          <li>
            you can designate an authorized agent to make a request under the
            CCPA on your behalf. We may deny a request from an authorized agent
            that does not submit proof that they have been validly authorized to
            act on your behalf in accordance with the CCPA.
          </li>
          <li>
            you may request to opt-out from future selling of your personal
            information to third parties. Upon receiving a request to opt-out,
            we will act upon the request as soon as feasibly possible, but no
            later than 15 days from the date of the request submission.
          </li>
          <p className="body">
            To exercise these rights, you can contact us by email at
            benner@fotura.co, or by referring to the contact details at the
            bottom of this document. If you have a complaint about how we handle
            your data, we would like to hear from you.{" "}
          </p>

          <h3 id="10">10. Do we make updates to this notice?</h3>
          <p className="body">
            <b>In Short:</b> Yes, we will update this notice as necessary to
            stay compliant with relevant laws.
          </p>
          <p className="body">
            We may update this privacy notice from time to time. The updated
            version will be indicated by an updated &quot;Revised&quot; date and
            the updated version will be effective as soon as it is accessible.
            If we make material changes to this privacy notice, we may notify
            you either by prominently posting a notice of such changes or by
            directly sending you a notification. We encourage you to review this
            privacy notice frequently to be informed of how we are protecting
            your information.
          </p>

          <h3 id="11">11. How can you contact us about this notice?</h3>
          <p className="body">
            If you have questions or comments about this notice, you may email
            us at <Link href="mailto:benner@fotura.co">benner@fotura.co</Link>
             or by post to:
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
