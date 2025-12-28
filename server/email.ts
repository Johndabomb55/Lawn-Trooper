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
  notes?: string;
}

export async function sendQuoteEmails(data: QuoteRequestData) {
  const { client, fromEmail } = getResendClient();

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
        <li><strong>Email:</strong> ${data.email || 'Not provided'}</li>
        <li><strong>Phone:</strong> ${data.phone || 'Not provided'}</li>
        <li><strong>Address:</strong> ${data.address}</li>
        <li><strong>Preferred Contact:</strong> ${data.contactMethod}</li>
      </ul>
      
      ${data.notes ? `<p><strong>Special Instructions / Notes:</strong><br/>${data.notes}</p>` : ''}
      
      <p style="margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
        <strong>Next Steps:</strong> Contact this customer to schedule a consultation and discuss plan options.
      </p>
      
      <p style="margin-top: 20px; color: #666; font-size: 12px;">
        Submitted via Lawn Trooper Quote Request Form
      </p>
    `
  };

  // Email to Customer (confirmation) - only if email provided
  const customerEmail = data.email ? {
    from: fromEmail,
    to: data.email,
    subject: 'Your Lawn Trooper Quote Request - Confirmation',
    html: `
      <h2>Thank you for your quote request!</h2>
      <p>Hi ${data.name},</p>
      <p>We've received your request for lawn care services. Our Account Commander will review your property information and contact you shortly via your preferred method (${data.contactMethod}) to schedule a consultation.</p>
      
      <p><strong>Your Request Summary:</strong></p>
      <ul>
        <li><strong>Address:</strong> ${data.address}</li>
        <li><strong>Preferred Contact:</strong> ${data.contactMethod}</li>
      </ul>
      
      <p>During your consultation, we'll discuss:</p>
      <ul>
        <li>Your property size and specific needs</li>
        <li>The best plan for your yard (Basic, Premium, or Executive)</li>
        <li>Available add-on services</li>
        <li>Current promotional offers</li>
      </ul>
      
      <p>We typically respond within 24 hours. If you have any urgent questions, feel free to call us directly.</p>
      
      <p>Thank you for choosing Lawn Trooper!</p>
      
      <p style="margin-top: 30px; color: #666; font-size: 12px;">
        Lawn Trooper LLC - 25+ years serving the Tennessee Valley<br/>
        This is an automated confirmation email.
      </p>
    `
  } : null;

  // Send emails
  try {
    console.log('Attempting to send emails via Resend...');
    console.log('From email:', fromEmail);
    console.log('To business:', businessEmail.to);
    console.log('To customer:', customerEmail?.to || 'No email provided');
    
    // Always send business email
    const businessResult = await client.emails.send(businessEmail);
    console.log('Business email result:', JSON.stringify(businessResult, null, 2));
    
    if (businessResult.error) {
      console.error('Business email error:', businessResult.error);
    }

    // Only send customer email if email was provided
    let customerEmailSent = true; // Default to true if no email to send
    if (customerEmail) {
      const customerResult = await client.emails.send(customerEmail);
      console.log('Customer email result:', JSON.stringify(customerResult, null, 2));
      
      if (customerResult.error) {
        console.error('Customer email error:', customerResult.error);
        customerEmailSent = false;
      } else {
        customerEmailSent = customerResult.data !== null;
      }
    } else {
      console.log('No customer email provided, skipping customer confirmation');
    }

    return {
      businessEmailSent: businessResult.data !== null && !businessResult.error,
      customerEmailSent: customerEmailSent
    };
  } catch (error) {
    console.error('Email sending failed with exception:', error);
    throw error;
  }
}
