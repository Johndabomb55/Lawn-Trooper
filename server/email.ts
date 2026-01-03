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

// Plan name mapping
const PLAN_NAMES: Record<string, string> = {
  basic: "Basic Patrol",
  premium: "Premium Patrol",
  executive: "Executive Patrol"
};

// Add-on label mapping
const ADDON_LABELS: Record<string, string> = {
  extra_bush_trimming: "Extra Bush Trimming",
  shrub_fertilization: "Shrub Fertilization / Diseased Plant Application",
  irrigation_check: "Full Irrigation Check/Diagnosis + Seasonal Activation & Winterization",
  fire_ant_app: "Quarterly Fire Ant Applications",
  quarterly_trash_bin_cleaning: "Quarterly Trash Bin Cleaning",
  gutter_cleaning_first_floor: "Gutter Cleaning (First Floor Only)",
  mulch_delivery_install_2yards: "Mulch Delivery + Installation (Up to 3 Yards)",
  pine_straw_delivery_install_3yards: "Pine Straw Delivery + Installation (Up to 4 Yards)",
  basic_flower_install: "Basic Flower Install (Fall Only)",
  basic_christmas_lights: "Basic Christmas Light Package",
  extra_weed_control: "Extra Weed Control + Fire Ant",
  pest_control: "Quarterly Pest Control Applications",
  aeration_overseeding: "Aeration + Overseeding",
  pressure_washing: "Driveway & Sidewalk Pressure Washing",
  mulch_delivery_install_over2yards: "Mulch Delivery + Installation (Up to 8 Yards)",
  pine_straw_delivery_install_over3yards: "Pine Straw Delivery + Installation (Up to 10 Yards)",
  premium_flower_install: "Premium Flower Install (Spring or 2 Seasons)",
  bimonthly_trash_bin_cleaning: "Monthly Trash Bin Cleaning",
  christmas_lights_premium: "Christmas Light Premium Package"
};

interface PhotoData {
  name: string;
  data: string; // base64 with data URL prefix
  type: string;
}

export interface QuoteRequestData {
  name: string;
  email: string;
  phone?: string;
  address: string;
  contactMethod: string;
  notes?: string;
  yardSize: string;
  plan: string;
  basicAddons: string[];
  premiumAddons: string[];
  photos?: PhotoData[];
}

function formatAddons(addons: string[]): string {
  if (!addons || addons.length === 0) return "None selected";
  return addons.map(id => ADDON_LABELS[id] || id).join(", ");
}

// Convert base64 data URL to attachment format for Resend
function prepareAttachments(photos: PhotoData[]) {
  return photos.map(photo => {
    // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
    const base64Data = photo.data.split(',')[1] || photo.data;
    return {
      filename: photo.name,
      content: base64Data,
    };
  });
}

export async function sendQuoteEmails(data: QuoteRequestData) {
  const { client, fromEmail } = getResendClient();

  const planName = PLAN_NAMES[data.plan] || data.plan;
  const basicAddonsFormatted = formatAddons(data.basicAddons);
  const premiumAddonsFormatted = formatAddons(data.premiumAddons);
  const hasPhotos = data.photos && data.photos.length > 0;

  // Prepare attachments if photos are provided
  const attachments = hasPhotos ? prepareAttachments(data.photos!) : [];

  // Email to Lawn Trooper (using verified email until domain is set up)
  // Change to 'lawntrooperllc@gmail.com' once domain is verified
  const businessEmail = {
    from: fromEmail,
    to: 'jclaxtonlandscapes@gmail.com',
    subject: `New Quote Request from ${data.name} - ${planName}${hasPhotos ? ' (with photos)' : ''}`,
    html: `
      <h2>New Quote Request</h2>
      
      <h3 style="color: #2E7D32; border-bottom: 2px solid #2E7D32; padding-bottom: 8px;">Customer Information</h3>
      <ul>
        <li><strong>Name:</strong> ${data.name}</li>
        <li><strong>Email:</strong> ${data.email || 'Not provided'}</li>
        <li><strong>Phone:</strong> ${data.phone || 'Not provided'}</li>
        <li><strong>Address:</strong> ${data.address}</li>
        <li><strong>Preferred Contact:</strong> ${data.contactMethod}</li>
      </ul>
      
      <h3 style="color: #5D4037; border-bottom: 2px solid #5D4037; padding-bottom: 8px;">Selected Plan Details</h3>
      <ul>
        <li><strong>Yard Size:</strong> ${data.yardSize} Acre</li>
        <li><strong>Plan:</strong> ${planName}</li>
        <li><strong>Basic Add-ons:</strong> ${basicAddonsFormatted}</li>
        <li><strong>Premium Add-ons:</strong> ${premiumAddonsFormatted}</li>
      </ul>
      
      ${hasPhotos ? `<p style="background: #E8F5E9; padding: 10px; border-radius: 4px;"><strong>📸 ${data.photos!.length} yard photo${data.photos!.length > 1 ? 's' : ''} attached</strong></p>` : ''}
      
      ${data.notes ? `<h3 style="color: #666;">Special Instructions / Notes</h3><p>${data.notes}</p>` : ''}
      
      <p style="margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
        <strong>Next Steps:</strong> Contact this customer to schedule a consultation and finalize their plan.
      </p>
      
      <p style="margin-top: 20px; color: #666; font-size: 12px;">
        Submitted via Lawn Trooper Quote Request Form
      </p>
    `,
    attachments: attachments.length > 0 ? attachments : undefined
  };

  // Email to Customer (confirmation) - only if email provided
  const customerEmail = data.email ? {
    from: fromEmail,
    to: data.email,
    subject: 'Your Lawn Trooper Quote Request - Confirmation',
    html: `
      <h2>Thank you for your quote request!</h2>
      <p>Hi ${data.name},</p>
      <p>We've received your request for lawn care services. Our Account Commander will review your information and contact you shortly via your preferred method (${data.contactMethod}) to schedule a consultation.</p>
      
      <h3 style="color: #2E7D32; border-bottom: 2px solid #2E7D32; padding-bottom: 8px;">Your Selected Plan</h3>
      <ul>
        <li><strong>Address:</strong> ${data.address}</li>
        <li><strong>Yard Size:</strong> ${data.yardSize} Acre</li>
        <li><strong>Plan:</strong> ${planName}</li>
        <li><strong>Basic Add-ons:</strong> ${basicAddonsFormatted}</li>
        <li><strong>Premium Add-ons:</strong> ${premiumAddonsFormatted}</li>
      </ul>
      
      ${hasPhotos ? `<p style="background: #E8F5E9; padding: 10px; border-radius: 4px;">📸 You attached ${data.photos!.length} yard photo${data.photos!.length > 1 ? 's' : ''} to your request.</p>` : ''}
      
      <p style="margin-top: 20px; padding: 15px; background: #E8F5E9; border-radius: 8px; border-left: 4px solid #2E7D32;">
        <strong>What's Next?</strong><br/>
        During your consultation, we'll confirm your yard size, discuss any special needs, and finalize your plan. Current promotional offers will be applied at signup!
      </p>
      
      <p>We typically respond within 24 hours. If you have any urgent questions, feel free to contact us directly.</p>
      
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
    console.log('Plan data:', { yardSize: data.yardSize, plan: data.plan, basicAddons: data.basicAddons, premiumAddons: data.premiumAddons });
    console.log('Photos attached:', hasPhotos ? data.photos!.length : 0);
    
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
