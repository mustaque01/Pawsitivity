import React from 'react';
import { Link } from 'react-router-dom';

const ContactInfoItem = ({ icon, title, lines, description }) => (
    <div className="group p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                {icon}
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                {description && <p className="text-sm text-gray-600 mb-3">{description}</p>}
                {lines.map((line, idx) => (
                    <p key={idx} className="text-gray-700 font-medium">{line}</p>
                ))}
            </div>
        </div>
    </div>
);

const FormInput = ({ id, label, type = 'text', required = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
        <input
            type={type}
            id={id}
            name={id}
            required={required}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder={`Enter your ${label.toLowerCase()}`}
        />
    </div>
);

export default function ContactUs() {
    const contactDetails = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: 'Email',
            description: 'Send us a message anytime',
            lines: ['info@thepawsitivity.com', 'sales@thepawsitivity.com']
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            title: 'Phone',
            description: 'Call us during business hours',
            lines: ['+91 86372 15100']
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: 'Office Address',
            description: 'Visit us at our headquarters',
            lines: ['196 G Sector Silicon City', 'Indore 452012, India']
        }
    ];

    return (
        <div className="font-sans bg-gray-50 min-h-screen">
            <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
                        Get in Touch
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
                        Contact <span className="text-amber-500">Pawsitivity</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                        Ready to make a difference? Connect with our team to learn more about our programs, partnerships, or how you can get involved in creating positive impact.
                    </p>
                </div>

                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-16">
                    {contactDetails.map(item => (
                        <ContactInfoItem key={item.title} {...item} />
                    ))}
                </div>
                
                {/* Contact Form */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
                            <p className="text-gray-600">
                                Fill out the form below and we'll get back to you within 24 hours.
                            </p>
                        </div>

                        <form action="#" method="POST" className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <FormInput id="firstName" label="First Name" required />
                                <FormInput id="lastName" label="Last Name" required />
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <FormInput id="email" label="Email Address" type="email" required />
                                <FormInput id="phone" label="Phone Number" type="tel" />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                                <select
                                    id="subject"
                                    name="subject"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                >
                                    <option value="">Select a topic</option>
                                    <option value="partnership">Partnership Opportunities</option>
                                    <option value="program">Program Information</option>
                                    <option value="volunteer">Volunteer Opportunities</option>
                                    <option value="media">Media Inquiries</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="6"
                                    required
                                    placeholder="Tell us how we can help you..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                ></textarea>
                            </div>
                            <div className="text-center pt-4">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5"
                                >
                                    Send Message
                                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="text-center mt-16 p-8 bg-blue-50 rounded-2xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Mission</h3>
                    <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                        Whether you're interested in partnerships, volunteer opportunities, or learning more about our programs, we'd love to hear from you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            to="/about" 
                            className="inline-flex items-center px-6 py-3 text-base font-medium text-blue-600 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all"
                        >
                            Learn More About Us
                        </Link>
                        <Link 
                            to="/shop" 
                            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-all"
                        >
                            Shop Our Products
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}