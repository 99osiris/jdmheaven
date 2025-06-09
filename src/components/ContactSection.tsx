import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { toast } from './Toast';

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  carReference?: string;
};

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('contact_submissions')
        .insert([data]);

      if (error) throw error;

      toast.success('Thank you for your message. We will get back to you soon!');
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-midnight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-zen text-racing-red mb-4">Contact Us</h2>
          <p className="text-lg text-gray-300">Get in touch with our team of experts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-zen text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  disabled={isSubmitting}
                  {...register("name", { 
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters"
                    }
                  })}
                  className="mt-1 block w-full rounded-none bg-black/30 border border-gray-700 text-white shadow-sm focus:border-racing-red focus:ring-racing-red disabled:opacity-50 disabled:cursor-not-allowed transition"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-racing-red">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-zen text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  disabled={isSubmitting}
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="mt-1 block w-full rounded-none bg-black/30 border border-gray-700 text-white shadow-sm focus:border-racing-red focus:ring-racing-red disabled:opacity-50 disabled:cursor-not-allowed transition"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-racing-red">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-zen text-gray-300">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  disabled={isSubmitting}
                  {...register("phone", {
                    pattern: {
                      value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                      message: "Invalid phone number"
                    }
                  })}
                  className="mt-1 block w-full rounded-none bg-black/30 border border-gray-700 text-white shadow-sm focus:border-racing-red focus:ring-racing-red disabled:opacity-50 disabled:cursor-not-allowed transition"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-racing-red">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-zen text-gray-300">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  disabled={isSubmitting}
                  {...register("subject", { 
                    required: "Subject is required",
                    minLength: {
                      value: 5,
                      message: "Subject must be at least 5 characters"
                    }
                  })}
                  className="mt-1 block w-full rounded-none bg-black/30 border border-gray-700 text-white shadow-sm focus:border-racing-red focus:ring-racing-red disabled:opacity-50 disabled:cursor-not-allowed transition"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-racing-red">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="carReference" className="block text-sm font-zen text-gray-300">
                  Car Reference (if inquiring about a specific vehicle)
                </label>
                <input
                  type="text"
                  id="carReference"
                  disabled={isSubmitting}
                  {...register("carReference")}
                  className="mt-1 block w-full rounded-none bg-black/30 border border-gray-700 text-white shadow-sm focus:border-racing-red focus:ring-racing-red disabled:opacity-50 disabled:cursor-not-allowed transition"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-zen text-gray-300">
                  Message
                </label>
                <textarea
                  id="message"
                  disabled={isSubmitting}
                  {...register("message", { 
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters"
                    }
                  })}
                  rows={4}
                  className="mt-1 block w-full rounded-none bg-black/30 border border-gray-700 text-white shadow-sm focus:border-racing-red focus:ring-racing-red disabled:opacity-50 disabled:cursor-not-allowed transition"
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-racing-red">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-racing-red text-white py-3 px-6 rounded-none hover:bg-red-700 transition font-zen disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-zen text-racing-red mb-6">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-racing-red flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-zen text-white">Phone</h4>
                    <p className="mt-1 text-gray-300">+33 7 84 94 80 24</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-racing-red flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-zen text-white">Email</h4>
                    <p className="mt-1 text-gray-300">sales@jdmheaven.club</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-racing-red flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-zen text-white">Location</h4>
                    <p className="mt-1 text-gray-300">
                      129 Boulevard de Grenelle<br />
                      Paris, France<br />
                      75015
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/30 border border-racing-red/20 p-8">
              <h3 className="text-xl font-zen text-racing-red mb-4">Business Hours</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Monday - Friday: 9:00 - 18:00</li>
                <li>Saturday: 10:00 - 16:00</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;