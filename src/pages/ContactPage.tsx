import React, { useState } from 'react';
import { SchoolSettings } from '../types';
import { DataService } from '../services/dataService';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

interface ContactPageProps {
  settings: SchoolSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      alert('Please fill all mandatory fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await DataService.submitContactMessage({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
      });
      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      console.error(err);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <MessageSquare className="w-4 h-4" />
            <span>Connect with Us</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-crest">
            Contact & Location Information
          </h1>
          <p className="text-slate-300 max-w-2xl text-sm sm:text-base">
            Reach out to our administrative team in Inaruwa, Sunsari for admissions, student records, fee inquiries, or appointments.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h2 className="text-xl font-bold font-crest">Campus Contact Desk</h2>
              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-sm">School Address:</strong>
                    <span>{settings.address}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-sm">Telephone / Mobile:</strong>
                    <span>{settings.phone}</span>
                    {settings.altPhone && <span className="block">{settings.altPhone}</span>}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-sm">Official Email:</strong>
                    <span>{settings.email}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block text-sm">Administration Hours:</strong>
                    <span>{settings.officeHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 font-crest">Location Map</h3>
              <div className="h-52 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center text-center p-4 text-xs text-slate-600 space-y-2">
                <MapPin className="w-8 h-8 text-emerald-700 animate-bounce" />
                <p className="font-bold text-slate-800">Inaruwa English Boarding School (IEBS)</p>
                <p>Ward No. 1, Main Road, Inaruwa Municipality, Sunsari District, Koshi Province, Nepal</p>
                <span className="text-[11px] text-emerald-700 font-semibold bg-white px-3 py-1 rounded-full border border-emerald-200">
                  Easy access via Mahendra Highway / Inaruwa Chowk
                </span>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-crest">Send Us an Inquiry</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Have a question or feedback? Fill the form below and our administrative office will respond promptly.
                </p>
              </div>

              {success ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950 font-crest">Message Successfully Dispatched</h3>
                  <p className="text-xs text-emerald-800">
                    Thank you for reaching out to Inaruwa English Boarding School. Our office has logged your message.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Karki"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. ramesh@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="e.g. 9842011223"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Subject</label>
                      <input
                        type="text"
                        placeholder="e.g. Admission / Transport Inquiry"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Write your inquiry or feedback here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 text-slate-900"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs uppercase tracking-wider hover:from-emerald-700 hover:to-teal-800 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Sending...' : 'Send Message to Administration'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
