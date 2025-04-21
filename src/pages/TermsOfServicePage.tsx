import React from 'react';
import BackButton from '../components/BackButton';

const TermsOfServicePage = () => {
  return (
    <div className="pt-20">
      <div className="bg-midnight text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <BackButton className="mr-4" />
          </div>
          <h1 className="text-4xl font-zen mb-6">Terms of Service</h1>
          <p className="text-xl text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-zen text-midnight mb-4">1. Introduction</h2>
              <p className="text-gray-600">
                Welcome to JDM HEAVEN, a car import/export business specializing in Japanese Domestic Market (JDM) cars. 
                By accessing or using our website, you agree to comply with and be bound by these Terms of Service (ToS). 
                Please read these terms carefully before using our website or services.
              </p>
              <p className="text-gray-600">
                If you do not agree with any of these terms, you are prohibited from using the website or its services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-zen text-midnight mb-4">2. Use of Our Website</h2>
              <h3 className="text-xl font-zen text-midnight mb-2">Eligibility:</h3>
              <p className="text-gray-600">
                You must be at least 18 years old to use our website. By using the site, you represent and warrant that you 
                are at least 18 years old and have the legal authority to enter into a contract.
              </p>
              <h3 className="text-xl font-zen text-midnight mb-2 mt-4">License to Use the Website:</h3>
              <p className="text-gray-600">
                We grant you a limited, non-exclusive, non-transferable license to access and use our website for personal, 
                non-commercial purposes in accordance with these Terms of Service. All rights not explicitly granted are reserved.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-zen text-midnight mb-4">3. Car Listings and Product Information</h2>
              <h3 className="text-xl font-zen text-midnight mb-2">Accuracy of Information:</h3>
              <p className="text-gray-600">
                While we strive to provide accurate, up-to-date information on all car listings, specifications, prices, 
                and availability, we do not guarantee the accuracy of any content, including images, prices, and product details. 
                All car listings are subject to change without notice.
              </p>
              <h3 className="text-xl font-zen text-midnight mb-2 mt-4">Pricing:</h3>
              <p className="text-gray-600">
                Prices listed on our website are in Euros (€) and may be subject to taxes, duties, shipping fees, and other 
                charges depending on the import process and destination country. Prices are provided as estimates and are 
                subject to change based on market conditions and availability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-zen text-midnight mb-4">4. Shipping and Delivery</h2>
              <p className="text-gray-600">
                We arrange for the shipping of imported vehicles from Japan to your specified location. Shipping fees and 
                delivery times are estimated and may vary based on factors such as customs clearance, delivery address, 
                and shipping carrier.
              </p>
              <p className="text-gray-600 mt-4">
                You are responsible for any customs duties, taxes, and other fees associated with the importation of your 
                vehicle. These charges are not included in the price listed on our website and are your responsibility.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-zen text-midnight mb-4">5. Returns and Cancellations</h2>
              <p className="text-gray-600">
                Due to the nature of car imports, we do not accept returns. All sales are final once the vehicle is shipped.
                Orders may be canceled only before the shipping process begins. Once the car has been dispatched for shipping, 
                cancellations are not possible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-zen text-midnight mb-4">6. Privacy and Data Protection</h2>
              <p className="text-gray-600">
                Your privacy is important to us. Please refer to our Privacy Policy for information about how we collect, 
                use, and protect your personal information. By using our website, you consent to the collection and use 
                of your information as described in our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-zen text-midnight mb-4">7. Governing Law</h2>
              <p className="text-gray-600">
                These Terms of Service shall be governed by and construed in accordance with the laws of France, 
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-zen text-midnight mb-4">8. Changes to Terms of Service</h2>
              <p className="text-gray-600">
                We reserve the right to modify or update these Terms of Service at any time. Any changes will be posted 
                on this page, and the revised terms will be effective immediately upon posting. Your continued use of the 
                website after such changes constitutes your acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-zen text-midnight mb-4">9. Contact Information</h2>
              <p className="text-gray-600">
                If you have any questions about these Terms of Service, please contact us:
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

export default TermsOfServicePage;