import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mt-6 rounded-xl border border-border bg-card p-6 md:p-8">
          <h1 className="text-3xl font-bold text-primary">General Terms of Use</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: 07/03/2026</p>

          <p className="mt-6 text-sm leading-7">
            These terms govern your use of our Lawn Trooper LLC website (&quot;Website&quot;) or related services
            (collectively, &quot;Services&quot;) and any software that we include as part of the Services, including
            any Website, Content Files, scripts, instruction sets, and any related documentation (collectively,
            &quot;Software&quot;). By using the Services or Software, you agree to these terms of use. If you have
            entered into another agreement with us concerning specific Services or Software, then the terms of that
            agreement control where they conflict with these terms. As discussed more in Section 3 below, you retain
            all rights and ownership you have in your information that you provide and make available through the
            Services.
          </p>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-primary">Acknowledgement</h2>
            <p className="mt-2 text-sm leading-7">
              These are the Terms and Conditions governing the use of this Service and the agreement that operates
              between You and the Company. These Terms and Conditions set out the rights and obligations of all users
              regarding the use of the Service.
            </p>
            <p className="mt-2 text-sm leading-7">
              Your access to and use of the Service is conditioned on Your acceptance of and compliance with these
              Terms and Conditions. These Terms and Conditions apply to all visitors, users, and others who access or
              use the Service.
            </p>
            <p className="mt-2 text-sm leading-7">
              By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree
              with any part of these Terms and Conditions then You may not access the Service.
            </p>
            <p className="mt-2 text-sm leading-7">
              You represent that you are over the age of 18. The Company does not permit those under 18 to use the
              Service.
            </p>
            <p className="mt-2 text-sm leading-7">
              Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the
              Privacy Policy of the Company. Please read Our Privacy Policy carefully before using Our Service.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-primary">SMS Messaging Terms &amp; Compliance</h2>
            <div className="mt-3 space-y-4 text-sm leading-7">
              <div>
                <h3 className="font-semibold">1. Program Description</h3>
                <p>
                  This messaging program sends appointment confirmation and reminder messages to customers who have
                  booked an appointment with LAWN TROOPER LLC through our website at thelawntrooper.com, or via our
                  scheduling forms, and have explicitly opted in to receive SMS notifications. Opt-in is collected via
                  web forms with a dedicated checkbox for SMS consent. Messages include scheduling confirmations,
                  appointment reminders, rescheduling updates, and customer support communications.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">2. Cancellation Instructions</h3>
                <p>
                  You can cancel the SMS service at any time. Simply text &quot;STOP&quot; to the same number that sent
                  you messages. Upon sending &quot;STOP,&quot; we will confirm your unsubscribe status via SMS.
                  Following this confirmation, you will no longer receive SMS messages from us. To rejoin, sign up as
                  you did initially, and we will resume sending SMS messages to you.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">3. Support Information</h3>
                <p>
                  If you experience issues with the messaging program, reply with the keyword &quot;HELP&quot; for more
                  assistance, or reach out directly to{" "}
                  <a href="mailto:john@thelawntrooper.com" className="text-primary underline">
                    john@thelawntrooper.com
                  </a>{" "}
                  or call (256) 874-2059 during business hours.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">4. Carrier Liability</h3>
                <p>Carriers are not liable for delayed or undelivered messages.</p>
              </div>
              <div>
                <h3 className="font-semibold">5. Message &amp; Data Rates</h3>
                <p>
                  Message and data rates may apply for messages sent to you from us and to us from you. Message
                  frequency varies based on your service usage and appointment schedule. For questions about your text
                  plan or data plan, contact your wireless provider.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">6. Supported Carriers</h3>
                <p>
                  Our SMS program works with all major U.S. wireless carriers, including AT&amp;T, T-Mobile, Verizon,
                  Sprint, and most regional carriers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">7. Age Restriction</h3>
                <p>You must be 18 years or older to participate in our SMS program.</p>
              </div>
              <div>
                <h3 className="font-semibold">8. Privacy Policy</h3>
                <p>
                  For privacy-related inquiries, please refer to our Privacy Policy at{" "}
                  <a href="https://thelawntrooper.com/privacy-policy" className="text-primary underline" target="_blank" rel="noreferrer">
                    https://thelawntrooper.com/privacy-policy
                  </a>
                  .
                </p>
              </div>
              <p>
                We comply with all applicable laws and regulations, including the Telephone Consumer Protection Act
                (TCPA) and CTIA guidelines, regarding the use of SMS communications.
              </p>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-primary">General Terms</h2>
            <p className="mt-2 text-sm leading-7">
              This website (the &quot;Site&quot;) is owned and operated by LAWN TROOPER LLC (&quot;COMPANY,&quot;
              &quot;we&quot; or &quot;us&quot;). By using the Site, you agree to be bound by these Terms of Service
              and to use the Site in accordance with these Terms of Service, our Privacy Policy, and any additional
              terms and conditions that may apply to specific sections of the Site or to products and services
              available through the Site or from LAWN TROOPER LLC.
            </p>
            <p className="mt-2 text-sm leading-7">
              Accessing the Site, in any manner, whether automated or otherwise, constitutes use of the Site and your
              agreement to be bound by these Terms of Service.
            </p>
            <p className="mt-2 text-sm leading-7">
              We reserve the right to change these Terms of Service or to impose new conditions on the use of the Site
              from time to time, in which case we will post the revised Terms of Service on this website. By
              continuing to use the Site after we post any such changes, you accept the Terms of Service, as modified.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-primary">Intellectual Property Rights</h2>
            <h3 className="mt-4 text-base font-semibold">Our Limited License to You</h3>
            <p className="mt-2 text-sm leading-7">
              This Site and all the materials available on the Site are the property of LAWN TROOPER LLC and/or our
              affiliates or licensors and are protected by copyright, trademark, and other intellectual property laws.
              The Site is provided solely for your personal non-commercial use.
            </p>
            <p className="mt-2 text-sm leading-7">
              You may not use the Site or the materials available on the Site in a manner that constitutes an
              infringement of our rights or that has not been authorized by us.
            </p>
            <p className="mt-2 text-sm leading-7">
              Unless explicitly authorized, you may not modify, copy, reproduce, republish, upload, post, transmit,
              translate, sell, create derivative works, exploit, or distribute in any manner or medium any material
              from the Site. However, you may download and/or print one copy of individual pages for your personal,
              non-commercial use, provided that you keep intact all copyright and other proprietary notices.
            </p>

            <h3 className="mt-4 text-base font-semibold">Your License to Us</h3>
            <p className="mt-2 text-sm leading-7">
              By posting or submitting any material (including comments, blog entries, social media posts, photos, and
              videos) to us via the Site, internet groups, or other digital venues, you represent that you own the
              material or have obtained the necessary permissions. You grant us a royalty-free, perpetual, irrevocable,
              non-exclusive, worldwide license to use, modify, transmit, sell, exploit, create derivative works from,
              distribute, and publicly perform or display such material.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-primary">Disclaimers</h2>
            <p className="mt-2 text-sm leading-7">
              Throughout the Site, we may provide links and pointers to Internet sites maintained by third parties. Our
              linking to such third-party sites does not imply an endorsement or sponsorship of such sites or the
              information, products, or services offered on or through the sites.
            </p>
            <p className="mt-2 text-sm leading-7">
              The information, products, and services offered on or through the Site are provided &quot;as is&quot; and
              without warranties of any kind, either express or implied. To the fullest extent permissible pursuant to
              applicable law, we disclaim all warranties, including implied warranties of merchantability and fitness
              for a particular purpose.
            </p>
            <p className="mt-2 text-sm leading-7">
              You agree at all times to indemnify and hold harmless LAWN TROOPER LLC, its affiliates, and their
              respective officers, directors, agents, and employees from any claims, causes of action, damages,
              liabilities, costs, and expenses arising out of or related to your breach of any obligation, warranty, or
              representation under these Terms of Service.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-primary">Online Commerce</h2>
            <p className="mt-2 text-sm leading-7">
              Certain sections of the Site may allow you to purchase products and services from third-party vendors. We
              are not responsible for the quality, accuracy, timeliness, reliability, or any other aspect of these
              products and services. If you make a purchase from a third party linked through the Site, the information
              obtained during your visit, including payment information, may be collected by both the merchant and us.
            </p>
            <p className="mt-2 text-sm leading-7">
              Your participation in any dealings with third-party vendors is solely between you and the third party.
              LAWN TROOPER LLC shall not be responsible for any loss or damage incurred as a result of such dealings.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-primary">Registration &amp; Passwords</h2>
            <p className="mt-2 text-sm leading-7">
              To access certain features of the Site, you may be required to register and create an account. You agree
              to provide accurate, current, and complete information during the registration process. You are
              responsible for maintaining the confidentiality of your login credentials and for all activities conducted
              under your account.
            </p>
            <p className="mt-2 text-sm leading-7">
              If you suspect unauthorized use of your account, notify us immediately at{" "}
              <a href="mailto:john@thelawntrooper.com" className="text-primary underline">
                john@thelawntrooper.com
              </a>
              . We are not liable for any loss or damage arising from your failure to comply with this obligation.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-primary">Termination</h2>
            <p className="mt-2 text-sm leading-7">
              We reserve the right to terminate or suspend your access to the Site, without notice, if we determine
              that you have violated these Terms of Service or engaged in conduct that we deem inappropriate or
              unlawful. Upon termination, you must cease all use of the Site and any content obtained from it.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-primary">Governing Law</h2>
            <p className="mt-2 text-sm leading-7">
              These Terms of Service shall be governed by and construed in accordance with the laws of the state in
              which LAWN TROOPER LLC operates. Any dispute arising under these Terms shall be resolved exclusively
              through binding arbitration in that jurisdiction.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-primary">Changes to Terms of Service</h2>
            <p className="mt-2 text-sm leading-7">
              We may update these Terms of Service from time to time. The latest version will always be available on
              our website with the effective date.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-primary">Contact Us</h2>
            <p className="mt-2 text-sm leading-7">For any questions regarding these Terms of Service, please contact us:</p>
            <div className="mt-3 space-y-1 text-sm leading-7">
              <p>LAWN TROOPER LLC</p>
              <p>Phone: (256) 874-2059</p>
              <p>
                Email:{" "}
                <a href="mailto:john@thelawntrooper.com" className="text-primary underline">
                  john@thelawntrooper.com
                </a>
              </p>
              <p>
                Website:{" "}
                <a href="https://thelawntrooper.com" className="text-primary underline" target="_blank" rel="noreferrer">
                  thelawntrooper.com
                </a>
              </p>
            </div>
            <p className="mt-3 text-sm leading-7">
              By using our website and services, you consent to these Terms of Service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
