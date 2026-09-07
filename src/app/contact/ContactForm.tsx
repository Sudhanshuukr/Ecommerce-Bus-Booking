'use client';

import * as React from 'react';
import {
  Send,
  CheckCircle2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function ContactForm() {
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    pnr: '',
    category: 'Booking & Reservation',
    message: '',
  });

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your full name (max 50 chars).';
    } else if (formData.fullName.trim().length > 50) {
      errs.fullName = 'Name cannot exceed 50 characters.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    } else if (formData.email.trim().length > 80) {
      errs.email = 'Email cannot exceed 80 characters.';
    }

    if (formData.phone.trim() && formData.phone.trim().length > 15) {
      errs.phone = 'Phone number cannot exceed 15 characters.';
    }

    if (formData.pnr.trim() && formData.pnr.trim().length > 20) {
      errs.pnr = 'PNR reference cannot exceed 20 characters.';
    }

    if (!formData.message.trim()) {
      errs.message = 'Please provide details about your enquiry.';
    } else if (formData.message.trim().length > 500) {
      errs.message = 'Message cannot exceed 500 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate brief client processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      pnr: '',
      category: 'Booking & Reservation',
      message: '',
    });
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <Card className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 sm:p-8 text-center space-y-4 shadow-subtle">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-heading text-lg font-bold text-slate-900">
            Enquiry Validated
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Thank you, <span className="font-semibold text-slate-900">{formData.fullName}</span>. Your form input for <span className="font-semibold text-slate-900">{formData.category}</span> was validated successfully.
          </p>
          <p className="text-xs text-slate-500 bg-white/80 border border-blue-200/80 rounded-xl p-3 max-w-md mx-auto">
            <strong>Note:</strong> Automated email dispatch is not configured in this deployment environment. No actual email or external message was transmitted.
          </p>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="rounded-xl text-xs font-semibold"
          >
            Reset Form
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-subtle">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="fullName" className="font-bold text-slate-700">
                Full Name <span className="text-destructive">*</span>
              </label>
              <span className="text-[10px] text-muted-foreground">Max 50</span>
            </div>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fullName: e.target.value }))
              }
              placeholder="e.g. Rahul Sharma"
              maxLength={50}
              className="rounded-xl text-xs sm:text-sm border-slate-200"
              aria-invalid={!!errors.fullName}
            />
            {errors.fullName && (
              <p className="text-[11px] font-semibold text-destructive">{errors.fullName}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="email" className="font-bold text-slate-700">
                Email Address <span className="text-destructive">*</span>
              </label>
              <span className="text-[10px] text-muted-foreground">Max 80</span>
            </div>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="e.g. rahul@example.com"
              maxLength={80}
              className="rounded-xl text-xs sm:text-sm border-slate-200"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-[11px] font-semibold text-destructive">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Phone Number (Optional) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="phone" className="font-bold text-slate-700">
                Contact Phone <span className="text-[11px] font-normal text-muted-foreground">(Optional)</span>
              </label>
              <span className="text-[10px] text-muted-foreground">Max 15</span>
            </div>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="e.g. +91 98765 43210"
              maxLength={15}
              className="rounded-xl text-xs sm:text-sm border-slate-200"
              aria-invalid={!!errors.phone}
            />
            {errors.phone && (
              <p className="text-[11px] font-semibold text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Booking PNR Reference (Optional) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="pnr" className="font-bold text-slate-700">
                Booking Reference / PNR <span className="text-[11px] font-normal text-muted-foreground">(Optional)</span>
              </label>
              <span className="text-[10px] text-muted-foreground">Max 20</span>
            </div>
            <Input
              id="pnr"
              type="text"
              value={formData.pnr}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, pnr: e.target.value.toUpperCase() }))
              }
              placeholder="e.g. BK-2026-8941"
              maxLength={20}
              className="rounded-xl text-xs sm:text-sm uppercase font-mono border-slate-200"
              aria-invalid={!!errors.pnr}
            />
            {errors.pnr && (
              <p className="text-[11px] font-semibold text-destructive">{errors.pnr}</p>
            )}
          </div>
        </div>

        {/* Category Select */}
        <div className="space-y-1.5">
          <label htmlFor="category" className="text-xs font-bold text-slate-700 block">
            Enquiry Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
            className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="Booking & Reservation">Booking & Reservation Inquiries</option>
            <option value="Cancellation & Refunds">Cancellation & Refund Assistance</option>
            <option value="Schedule & Route Info">Schedule & Route Information</option>
            <option value="Operator Fleet Partnership">Operator Fleet Partnership</option>
            <option value="General Feedback">General Feedback & Other Inquiries</option>
          </select>
        </div>

        {/* Message Textarea with live character counter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="message" className="font-bold text-slate-700">
              Your Message / Enquiry <span className="text-destructive">*</span>
            </label>
            <span
              className={`text-[10px] font-medium ${
                formData.message.length >= 480
                  ? 'text-amber-600 font-bold'
                  : 'text-muted-foreground'
              }`}
            >
              {formData.message.length} / 500
            </span>
          </div>
          <textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, message: e.target.value }))
            }
            placeholder="Please provide specifics about your travel date, route, or enquiry..."
            maxLength={500}
            className="w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
            aria-invalid={!!errors.message}
          />
          {errors.message && (
            <p className="text-[11px] font-semibold text-destructive">{errors.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl font-bold text-xs sm:text-sm shadow-subtle hover:shadow-hover transition-all"
        >
          {isSubmitting ? (
            <span>Submitting Enquiry...</span>
          ) : (
            <span className="inline-flex items-center">
              <Send className="mr-2 h-4 w-4" />
              <span>Send Message to Bustkit Support</span>
            </span>
          )}
        </Button>
      </form>
    </Card>
  );
}
