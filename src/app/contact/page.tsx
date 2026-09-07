import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Mail,
  HelpCircle,
  Clock,
  Ticket,
  Building2,
  MessageSquare,
} from 'lucide-react';
import { AppShell, Container, Section } from '@/components/layout';
import { Card } from '@/components/ui/card';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Bustkit Passenger Support',
  description:
    'Reach Bustkit customer care for booking support, journey updates, ticket verification, and general platform enquiries.',
};

const SUPPORT_TOPICS = [
  {
    icon: Ticket,
    title: 'Booking & Ticket Verification',
    description: 'Need help finding your digital pass or verifying schedule details? Access your ticket anytime under My Bookings or message us.',
  },
  {
    icon: Clock,
    title: 'Cancellations & Adjustments',
    description: 'Inquiries regarding trip changes or cancellation terms on confirmed reservations across partner bus operators.',
  },
  {
    icon: Building2,
    title: 'Operator Partnerships',
    description: 'State transit corporations and certified private fleet operators interested in joining the Bustkit booking network.',
  },
  {
    icon: HelpCircle,
    title: 'General Enquiries',
    description: 'Questions regarding route coverage, onboard coach amenities, or general feedback about your Bustkit booking experience.',
  },
];

const FAQS = [
  {
    q: 'How do I access my digital e-ticket after booking?',
    a: 'Immediately upon completing your reservation, an interactive digital boarding pass is generated with your unique PNR reference. You can also view all past and upcoming tickets anytime by visiting the My Bookings section.',
  },
  {
    q: 'What do I need to present when boarding my bus?',
    a: 'You only need your Bustkit digital e-ticket (accessible on your smartphone with the booking reference) along with a valid government photo ID corresponding to the primary passenger name.',
  },
  {
    q: 'How are seat layouts and deck berths assigned?',
    a: 'Bustkit displays real-time interactive seat layouts for every scheduled bus service. You choose your exact lower or upper deck seat and sleeper/seater berth during the booking flow before checkout.',
  },
  {
    q: 'Are the bus operators on Bustkit verified?',
    a: 'Yes. Bustkit exclusively lists authenticated state transit corporations (such as UPSRTC, KSRTC, MSRTC, RSRTC, HRTC, UTC, TSRTC) and certified private fleet operators (such as IntrCity SmartBus, Zingbus, VRL Travels, and SRS Travels).',
  },
];

export default function ContactPage() {
  return (
    <AppShell>
      <div className="bg-background min-h-[calc(100vh-16rem)]">
        {/* Header Hero */}
        <Section spacing="md" className="pt-10 pb-12 sm:pt-14 sm:pb-16 bg-slate-50/50 border-b border-slate-200/80">
          <Container>
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center space-y-3">
              <div className="inline-flex items-center space-x-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Passenger Care & Support</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                Contact Bustkit Support
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
                Have questions about your bus ticket, schedule, or fleet operators? Our team is here to assist with your intercity journey enquiries.
              </p>
            </div>
          </Container>
        </Section>

        {/* Main Content Section: Topics & Form */}
        <Section spacing="md" className="py-12 sm:py-16">
          <Container className="space-y-12 sm:space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Column: Support Categories & Direct Contact */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    How Can We Help?
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Select an inquiry category or submit the support form. For instant self-service, you can also view active tickets under{' '}
                    <Link href="/my-bookings" className="text-primary font-semibold hover:underline">
                      My Bookings
                    </Link>
                    .
                  </p>
                </div>

                <div className="space-y-3">
                  {SUPPORT_TOPICS.map((topic, idx) => {
                    const Icon = topic.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-start space-x-3.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-subtle"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="space-y-0.5">
                          <h3 className="font-heading text-xs sm:text-sm font-bold text-slate-900">
                            {topic.title}
                          </h3>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {topic.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Direct Support Status Card */}
                <Card className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-5 space-y-3 shadow-modal">
                  <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                    <Mail className="h-4 w-4" />
                    <span>Support Channels</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Direct email dispatch and phone helplines are not configured in this project setup. To review or cancel existing tickets, please use self-service management directly via{' '}
                    <Link href="/my-bookings" className="text-teal-400 underline font-semibold">
                      My Bookings
                    </Link>
                    .
                  </p>
                </Card>
              </div>

              {/* Right Column: Interactive Contact Form */}
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    Send an Enquiry
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Fill out the form below with your booking or general query details.
                  </p>
                </div>

                <ContactForm />
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="space-y-6 pt-6 border-t border-slate-200">
              <div className="text-center max-w-xl mx-auto space-y-1.5">
                <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs text-muted-foreground">
                  Quick answers to common questions regarding Bustkit reservations and services.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FAQS.map((faq, idx) => (
                  <Card
                    key={idx}
                    className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-subtle space-y-2"
                  >
                    <h3 className="font-heading text-xs sm:text-sm font-bold text-slate-900 flex items-start space-x-2">
                      <span className="text-primary font-extrabold shrink-0">Q.</span>
                      <span>{faq.q}</span>
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-4">
                      {faq.a}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      </div>
    </AppShell>
  );
}
