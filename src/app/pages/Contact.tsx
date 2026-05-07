import { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Select } from '../components/Select';

const inquiryTypes = [
  { value: '', label: 'Select inquiry type' },
  { value: 'partnership', label: 'Partnership Inquiry' },
  { value: 'media', label: 'Media & Press' },
  { value: 'story', label: 'Submit a Story' },
  { value: 'support', label: 'General Support' },
  { value: 'other', label: 'Other' }
];

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    inquiryType: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-8 text-center">
            Get In Touch
          </h1>
          <p className="text-xl text-center mb-16">
            Questions? Partnership inquiries? Story submissions? We'd love to hear from you.
          </p>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-black uppercase mb-6">Contact Info</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-[#dd3935] pl-6">
                  <div className="text-sm font-mono uppercase mb-1">General Inquiries</div>
                  <a href="mailto:hello@notwaiting.africa" className="text-lg hover:text-[#dd3935]">
                    hello@notwaiting.africa
                  </a>
                </div>

                <div className="border-l-4 border-[#dd3935] pl-6">
                  <div className="text-sm font-mono uppercase mb-1">Partnerships</div>
                  <a href="mailto:partners@notwaiting.africa" className="text-lg hover:text-[#dd3935]">
                    partners@notwaiting.africa
                  </a>
                </div>

                <div className="border-l-4 border-[#dd3935] pl-6">
                  <div className="text-sm font-mono uppercase mb-1">Media & Press</div>
                  <a href="mailto:press@notwaiting.africa" className="text-lg hover:text-[#dd3935]">
                    press@notwaiting.africa
                  </a>
                </div>

                <div className="border-l-4 border-[#dd3935] pl-6">
                  <div className="text-sm font-mono uppercase mb-1">Story Submissions</div>
                  <a href="mailto:stories@notwaiting.africa" className="text-lg hover:text-[#dd3935]">
                    stories@notwaiting.africa
                  </a>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-2xl font-black uppercase mb-4">Follow the Wave</h3>
                <div className="flex gap-4 text-sm">
                  <a href="#" className="hover:text-[#dd3935] transition-colors">Twitter/X</a>
                  <a href="#" className="hover:text-[#dd3935] transition-colors">Instagram</a>
                  <a href="#" className="hover:text-[#dd3935] transition-colors">LinkedIn</a>
                  <a href="#" className="hover:text-[#dd3935] transition-colors">YouTube</a>
                </div>
              </div>
            </div>

            <div>
              {!formSubmitted ? (
                <>
                  <h2 className="text-3xl font-black uppercase mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                      label="Name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <Input
                      label="Email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <Input
                      label="Organization (optional)"
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    />

                    <Select
                      label="Inquiry Type"
                      required
                      options={inquiryTypes}
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    />

                    <Textarea
                      label="Message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />

                    <Button type="submit" className="w-full py-4">
                      Send Message →
                    </Button>
                  </form>
                </>
              ) : (
                <div className="bg-[#F5F5F5] p-8 border-2 border-[#0C0C0A] text-center">
                  <h2 className="text-3xl font-black uppercase mb-4">Message Sent!</h2>
                  <p className="text-lg mb-6">
                    Thanks for reaching out, {formData.name}. We'll get back to you soon.
                  </p>
                  <Button onClick={() => setFormSubmitted(false)} variant="secondary">
                    Send Another Message
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#0C0C0A] text-white p-12 text-center">
            <h2 className="text-4xl font-black uppercase mb-4">Join the Movement</h2>
            <p className="text-xl mb-6">
              The best way to connect with #NotWaiting is to become part of it.
            </p>
            <p className="text-lg mb-2">Sign the manifesto. Share your wave. Build in public.</p>
            <p className="text-sm text-white/60">We're #NotWaiting — and neither should you.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
