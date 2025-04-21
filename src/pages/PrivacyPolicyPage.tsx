import React from 'react';
import BackButton from '../components/BackButton';

const PrivacyPolicyPage = () => {
  return (
    <div className="pt-20">
      <div className="bg-midnight text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <BackButton className="mr-4" />
          </div>
          <h1 className="text-4xl font-zen mb-6">Privacy Policy</h1>
          <p className="text-xl text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-zen text-midnight mb-6">Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We collect various types of information to improve your experience and process your requests effectively. 
                The information we may collect includes:
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">Personal Identification Information</h3>
                  <p className="text-gray-600">
                    Name, email address, phone number, and postal address when you create an account, fill out a form, or make a purchase.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">Vehicle Information</h3>
                  <p className="text-gray-600">
                    Details on the cars you're interested in, including specific models, makes, preferences for mods, and any vehicles you've saved to your wishlist.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">Payment Information</h3>
                  <p className="text-gray-600">
                    Billing information, including credit card details, when making a purchase. All payment data is processed securely.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">Technical Data</h3>
                  <p className="text-gray-600">
                    We collect technical data, such as your IP address, browser type, device information, and browsing history for analytics, security, and enhancing the user experience.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">Communication Data</h3>
                  <p className="text-gray-600">
                    Any messages, inquiries, or emails you send us through forms or directly.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-zen text-midnight mb-6">How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We prioritize your privacy and use the information collected for the following purposes:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">Service Fulfillment</h3>
                  <p className="text-gray-600">
                    To process your car import requests, provide personalized quotes, and facilitate the purchase or leasing of vehicles.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">Personalized Experience</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>To suggest vehicles based on your browsing and vehicle preferences.</li>
                    <li>To save your favorite cars and build a tailored experience each time you visit.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">Marketing and Promotional Communications</h3>
                  <p className="text-gray-600">
                    To send you updates on new arrivals, exclusive offers, or newsletters with JDM news, events, or promotions, but only if you've opted in.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">Analytics & Performance</h3>
                  <p className="text-gray-600">
                    To monitor and analyze website usage to improve our services, detect issues, and optimize user experience.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">Legal Compliance</h3>
                  <p className="text-gray-600">
                    To comply with legal obligations, enforce our terms of service, and protect against fraud or other illegal activities.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-zen text-midnight mb-6">Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We respect your privacy and are committed to protecting your personal information. However, we may share your information with trusted third parties under the following circumstances:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">Service Providers</h3>
                  <p className="text-gray-600">
                    We may share your information with third-party providers that assist with operations, such as payment processing, logistics, compliance, and customer service.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">Legal Requirements</h3>
                  <p className="text-gray-600">
                    If required by law, we may disclose your personal information to comply with any legal process or government request, including but not limited to subpoenas, warrants, or court orders.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">Business Transactions</h3>
                  <p className="text-gray-600">
                    In the event of a merger, acquisition, or sale of assets, your personal information may be transferred as part of that transaction. We will notify you prior to such a transfer.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">With Your Consent</h3>
                  <p className="text-gray-600">
                    We may share information with partners or other entities with your explicit consent, such as during special promotions or collaborations.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-zen text-midnight mb-6">Your Rights</h2>
              <p className="text-gray-600 mb-4">
                We value your control over your personal data. As a user, you have the following rights:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">Right to Access</h3>
                  <p className="text-gray-600">
                    You can request access to the personal information we have collected about you. This will include details on how it was used and with whom it was shared.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">Right to Correction</h3>
                  <p className="text-gray-600">
                    If any of your personal information is incorrect or outdated, you have the right to request corrections or updates.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">Right to Deletion</h3>
                  <p className="text-gray-600">
                    You can request the deletion of your personal information from our systems, except where we are required to retain data for legal, accounting, or other business purposes.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">Right to Object</h3>
                  <p className="text-gray-600">
                    If you don't want us to process your data for marketing purposes, you can opt-out at any time by following the unsubscribe link in our emails or contacting us directly.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">Right to Restrict Processing</h3>
                  <p className="text-gray-600">
                    You can request that we restrict the processing of your data if you believe it's incorrect, if you object to its use, or if you need it for legal purposes.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-zen text-midnight mb-3">Right to Data Portability</h3>
                  <p className="text-gray-600">
                    You have the right to receive your data in a structured, commonly used format and transfer it to another service provider if you wish.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-zen text-midnight mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about our Privacy Policy, please contact us at:
              </p>
              <ul className="list-none pl-0 mt-4 space-y-2 text-gray-600">
                <li>Email: sales@jdmheaven.club</li>
                <li>Phone: +33 7 84 94 80 24</li>
                <li>Address: 129 Boulevard de Grenelle, Paris, France 75015</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;