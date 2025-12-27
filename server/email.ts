// Integration with Resend for sending emails
import { Resend } from 'resend';

// Use RESEND_API_KEY secret directly for reliability
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY secret is not configured');
  }
  
  console.log('Using Resend API key from secret (starts with):', apiKey.substring(0, 6) + '...');
  
  // Use Resend's shared domain for testing (until lawntrooper.com is verified)
  // Change to 'noreply@lawntrooper.com' once domain is verified in Resend
  const fromEmail = 'Lawn Trooper <onboarding@resend.dev>';
  
  return {
    client: new Resend(apiKey),
    fromEmail: fromEmail
  };
}

export interface QuoteRequestData {
  name: string;
  email: string;
  phone?: string;
  address: string;
  contactMethod: string;
  yardSize: number;
  plan: string;
  addOns: string[];
  notes?: string;
}

export async function sendQuoteEmails(data: QuoteRequestData) {
  const { client, fromEmail } = getResendClient();

  // Format add-ons list
  const addOnsText = data.addOns.length > 0 
    ? data.addOns.join(', ') 
    : 'None selected';

  // Email to Lawn Trooper (using verified email until domain is set up)
  // Change to 'lawntrooperllc@gmail.com' once domain is verified
  const businessEmail = {
    from: fromEmail,
    to: 'jclaxtonlandscapes@gmail.com',
    subject: `New Quote Request from ${data.name}`,
    html: `
      <h2>New Quote Request</h2>
      <p><strong>Customer Information:</strong></p>
      <ul>
        <li><strong>Name:</strong> ${data.name}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Phone:</strong> ${data.phone || 'Not provided'}</li>
        <li><strong>Address:</strong> ${data.address}</li>
        <li><strong>Preferred Contact:</strong> ${data.contactMethod}</li>
      </ul>
      
      <p><strong>Property & Service Details:</strong></p>
      <ul>
        <li><strong>Lot Size:</strong> ${data.yardSize} acres</li>
        <li><strong>Plan Selected:</strong> ${data.plan.charAt(0).toUpperCase() + data.plan.slice(1)}</li>
        <li><strong>Add-ons:</strong> ${addOnsText}</li>
      </ul>
      
      ${data.notes ? `<p><strong>Special Instructions:</strong><br/>${data.notes}</p>` : ''}
      
      <p style="margin-top: 20px; color: #666; font-size: 12px;">
        Submitted via Lawn Trooper Quote Request Form
      </p>
    `
  };

  // Email to Customer (confirmation)
  const customerEmail = {
    from: fromEmail,
    to: data.email,
    subject: 'Your Lawn Trooper Quote Request - Confirmation',
    html: `
      <h2>Thank you for your quote request!</h2>
      <p>Hi ${data.name},</p>
      <p>We've received your request for lawn care services. Our team will review your information and contact you shortly via ${data.contactMethod}.</p>
      
      <p><strong>Your Request Summary:</strong></p>
      <ul>
        <li><strong>Address:</strong> ${data.address}</li>
        <li><strong>Lot Size:</strong> ${data.yardSize} acres</li>
        <li><strong>Plan:</strong> ${data.plan.charAt(0).toUpperCase() + data.plan.slice(1)}</li>
        <li><strong>Add-ons:</strong> ${addOnsText}</li>
      </ul>
      
      <p>We typically respond within 24 hours. If you have any urgent questions, feel free to call us directly.</p>
      
      <p>Thank you for choosing Lawn Trooper!</p>
      
      <p style="margin-top: 30px; color: #666; font-size: 12px;">
        Lawn Trooper LLC - 25+ years serving the Tennessee Valley<br/>
        This is an automated confirmation email.
      </p>
    `
  };

  // Send both emails
  try {
    console.log('Attempting to send emails via Resend...');
    console.log('From email:', fromEmail);
    console.log('To business:', businessEmail.to);
    console.log('To customer:', customerEmail.to);
    
    const [businessResult, customerResult] = await Promise.all([
      client.emails.send(businessEmail),
      client.emails.send(customerEmail)
    ]);

    console.log('Business email result:', JSON.stringify(businessResult, null, 2));
    console.log('Customer email result:', JSON.stringify(customerResult, null, 2));

    if (businessResult.error) {
      console.error('Business email error:', businessResult.error);
    }
    if (customerResult.error) {
      console.error('Customer email error:', customerResult.error);
    }

    return {
      businessEmailSent: businessResult.data !== null && !businessResult.error,
      customerEmailSent: customerResult.data !== null && !customerResult.error
    };
  } catch (error) {
    console.error('Email sending failed with exception:', error);
    throw error;
  }
}
