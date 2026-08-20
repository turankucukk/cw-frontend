"use server";

import nodemailer from "nodemailer";

// Nodemailer yapılandırması
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendReservationEmail(
  to: string,
  roomName: string,
  startTime: string,
  endTime: string,
  status: string
) {
  try {
    const isPending = status === "pending";
    const statusText = isPending 
      ? "Onay Bekliyor ⏳" 
      : "Onaylandı 🎉";
      
    const messageText = isPending
      ? "DeskHere üzerinden yaptığınız rezervasyon isteği alınmıştır. Yöneticilerimiz tarafından onaylandığında bilgilendirileceksiniz."
      : "DeskHere üzerinden yaptığınız rezervasyon başarıyla onaylanmıştır. Detayları aşağıda bulabilirsiniz:";

    const mailOptions = {
      from: `"DeskHere" <${process.env.EMAIL_USER}>`,
      to,
      subject: `DeskHere - Rezervasyon ${isPending ? "Talebiniz Alındı" : "Onayı"}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
          <h2 style="color: #0f172a; text-align: center; margin-bottom: 30px;">DeskHere Rezervasyon ${statusText}</h2>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">Merhaba,</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">${messageText}</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2563eb;">
            <p style="margin: 10px 0; color: #1e293b;"><strong>🏢 Alan/Oda:</strong> ${roomName}</p>
            <p style="margin: 10px 0; color: #1e293b;"><strong>📅 Tarih:</strong> ${new Date(startTime).toLocaleDateString('tr-TR')}</p>
            <p style="margin: 10px 0; color: #1e293b;"><strong>⏰ Saat:</strong> ${new Date(startTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(endTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
            <p style="margin: 10px 0; color: #1e293b;"><strong>📌 Durum:</strong> ${isPending ? "Yönetici Onayı Bekliyor" : "Onaylandı (Ödendi)"}</p>
          </div>
          
          <p style="color: #475569; font-size: 14px; text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            Bizi tercih ettiğiniz için teşekkür ederiz.<br/>
            <strong>DeskHere Ekibi</strong>
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Mail başarıyla gönderildi:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Mail gönderilemedi:", error);
    return { success: false, error: String(error) };
  }
}

export async function sendComplaintEmail(
  userName: string,
  userEmail: string,
  subject: string,
  message: string
) {
  try {
    const adminEmail = process.env.EMAIL_USER; // Şikayetlerin yöneticinin kendisine (Gmail'e) gitmesi için.
    
    const mailOptions = {
      from: `"DeskHere Sistem" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `🚨 Yeni Bir Şikayet/Bildirim Var: ${subject}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; max-width: 600px; border: 1px solid #fee2e2; border-radius: 8px; background-color: #fef2f2;">
          <h2 style="color: #991b1b; border-bottom: 2px solid #fecaca; padding-bottom: 10px;">Yeni Bir Şikayet / Destek Talebi</h2>
          <p><strong>Gönderen:</strong> ${userName}</p>
          <p><strong>E-Posta:</strong> ${userEmail}</p>
          <p><strong>Konu:</strong> ${subject}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: white; border-radius: 5px; color: #334155; line-height: 1.6;">
            <strong>Mesaj Detayı:</strong><br/>
            ${message.replace(/\n/g, '<br/>')}
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Şikayet maili gönderilemedi:", error);
    return { success: false, error: String(error) };
  }
}
