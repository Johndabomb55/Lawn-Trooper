// Integration with Resend for sending emails
import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  console.log('Fetching Resend credentials from connector...');
  console.log('Hostname:', hostname);
  console.log('Token type:', xReplitToken ? (xReplitToken.startsWith('repl ') ? 'repl' : 'depl') : 'none');

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  const response = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  );
  
  const data = await response.json();
  console.log('Connector response items count:', data.items?.length || 0);
  
  connectionSettings = data.items?.[0];

  if (!connectionSettings || (!connectionSettings.settings?.api_key)) {
    console.error('Resend connection settings missing or invalid');
    throw new Error('Resend not connected');
  }
  
  console.log('API key starts with:', connectionSettings.settings.api_key?.substring(0, 6) + '...');
  console.log('From email:', connectionSettings.settings.from_email);
  
  return {apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email};
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
async function getUncachableResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
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
  const { client, fromEmail } = await getUncachableResendClient();

  // Format add-ons list
  const addOnsText = data.addOns.length > 0 
    ? data.addOns.join(', ') 
    : 'None selected';

  // Email to Lawn Trooper
  const businessEmail = {
    from: fromEmail,
    to: 'lawntrooperllc@gmail.com',
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
