import { serve } from "std/http/server.ts"
import { createClient } from "supabase"
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * SHARED STYLES 
 */
const CSS_STYLES = `
  body{margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#FDFBF7;color:#000000}
  .wrapper{width:100%;table-layout:fixed;background-color:#FDFBF7;padding-bottom:40px}
  .main{background-color:#ffffff;margin:0 auto;width:100%;max-width:600px;border-spacing:0;border:1px solid #E5E1DA;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05)}
  .header{background-color:#000000;padding:40px;text-align:center}
  .header h1{color:#D4AF37;margin:0;font-size:24px;letter-spacing:2px;text-transform:uppercase}
  .content{padding:40px;line-height:1.6}
  .content h2{font-size:20px;margin-top:0;color:#000}
  .details-box{background-color:#F9F7F2;padding:25px;border-left:4px solid #D4AF37;margin:25px 0}
  .footer{padding:30px;text-align:center;font-size:12px;color:#999;background-color:#F9F7F2;border-top:1px solid #E5E1DA}
  .gold-btn{display:inline-block;padding:14px 28px;background-color:#D4AF37;color:#ffffff;text-decoration:none;font-weight:bold;border-radius:8px;margin-top:20px;text-transform:uppercase;letter-spacing:1px}
  .divider{height:1px;background-color:#E5E1DA;margin:30px 0}
  .highlight{color:#D4AF37;font-weight:700}
`;

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { lead } = body
    
    if (!lead || !lead.email) throw new Error('Lead data missing.')

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Fetch SMTP Credentials
    const { data: settings } = await supabaseAdmin
      .from('erp_settings')
      .select('key, value')
      .in('key', ['GOOGLE_APP_PASSWORD', 'GOOGLE_EMAIL'])

    const smtpPass = settings?.find((s: any) => s.key === 'GOOGLE_APP_PASSWORD')?.value
    const smtpEmail = settings?.find((s: any) => s.key === 'GOOGLE_EMAIL')?.value

    if (!smtpPass || !smtpEmail) throw new Error('SMTP credentials not configured.')

    const type = lead.type || 'consult'
    const origin = lead.origin || 'General Inquiry'
    const name = lead.full_name || 'Valued Client'

    // 2. Resolve Template & Subject
    let subject = "Inquiry Received - UPLYNK Strategic Engineering"
    let heading = "Strategic Connection Confirmed"
    let message = `We have received your strategic brief regarding <span class="highlight">${lead.company || 'Private Organization'}</span>. Our technical leads are currently performing an initial assessment of your requirements.`

    if (type === 'academy') {
      subject = `[Academy] Enrollment Initiated: ${lead.course || 'Technical Track'}`
      heading = "Enrollment Protocol Started"
      message = `Welcome to UPLYNK Academy. You have successfully initiated your enrollment for the <span class="highlight">${lead.course || 'Technical Track'}</span> specialization. Our registrars are reviewing your background.`
    } else if (type === 'service') {
      subject = `[Engineering] Service Request: ${lead.origin || 'Specialized Capability'}`
      heading = "Technical Ingestion Protocol"
      message = `Your request for digital intervention regarding <span class="highlight">${lead.origin || 'Elite Capability'}</span> has been prioritised. Our lead architects are currently analyzing your architectural brief.`
    }

    const htmlTemplate = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>UPLYNK Tech</title><style>${CSS_STYLES}</style></head>
    <body><center class="wrapper"><table class="main" width="100%">
      <tr><td class="header"><h1>UPLYNK <span style="color:#fff">TECH</span></h1></td></tr>
      <tr><td class="content">
        <h2>Hello, ${name}</h2>
        <p>${message}</p>
        <p>We pride ourselves on high-stakes rapid alignment. You can expect a response within 24 operational hours to schedule a deep-dive session.</p>
        <div class="divider"></div>
        <h3>Ingestion Summary:</h3>
        <div class="details-box">
          <p><strong>Identity:</strong> ${name}</p>
          <p><strong>Context:</strong> ${origin}</p>
          <p><strong>Channel:</strong> Digital Ingestion Portal</p>
        </div>
        <p>In the meantime, feel free to explore our elite engineering portfolio or curriculum updates.</p>
        <a href="https://uplynktech.com" class="gold-btn">Visit Our Portal</a>
      </td></tr>
      <tr><td class="footer">
        <p>&copy; 2026 UPLYNK Analytics & Engineering. All rights reserved.</p>
        <p>Technical Supremacy | Enterprise Stability</p>
      </td></tr>
    </table></center></body></html>`;

    // 3. SMTP Handshake & Transmission
    const client = new SmtpClient()
    await client.connectTLS({
      hostname: "smtp.gmail.com",
      port: 465,
      username: smtpEmail,
      password: smtpPass,
    })

    await client.send({
      from: smtpEmail,
      to: lead.email,
      subject: subject,
      content: htmlTemplate,
      html: htmlTemplate,
    })

    await client.close()
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error(`[SMTP_ERROR] ${error.message}`)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
