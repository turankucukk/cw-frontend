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
    const isCancelled = status === "cancelled";
    
    let statusText = "Onaylandı ✅";
    if (isPending) statusText = "Onay Bekliyor ⏳";
    if (isCancelled) statusText = "Reddedildi ❌";
      
    let messageText = "DeskHere üzerinden yaptığınız rezervasyon başarıyla onaylanmıştır. Detayları aşağıda bulabilirsiniz:";
    if (isPending) messageText = "DeskHere üzerinden yaptığınız rezervasyon isteği alınmıştır. Yöneticilerimiz tarafından onaylandığında bilgilendirileceksiniz.";
    if (isCancelled) messageText = "DeskHere üzerinden yaptığınız rezervasyon isteği yöneticilerimiz tarafından maalesef reddedilmiştir. Ödemeniz iade edilecektir.";

    let subjectText = "Onayı";
    if (isPending) subjectText = "Talebiniz Alındı";
    if (isCancelled) subjectText = "Talebiniz Reddedildi";

    const mailOptions = {
      from: `"DeskHere" <${process.env.EMAIL_USER}>`,
      to,
      subject: `DeskHere - Rezervasyon ${subjectText}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
          <h2 style="color: ${isCancelled ? '#dc2626' : '#0f172a'}; text-align: center; margin-bottom: 30px;">DeskHere Rezervasyon ${statusText}</h2>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">Merhaba,</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">${messageText}</p>
          
          <div style="background-color: ${isCancelled ? '#fef2f2' : '#f8fafc'}; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid ${isCancelled ? '#ef4444' : '#2563eb'};">
            <p style="margin: 10px 0; color: #1e293b;"><strong>🏢 Alan/Oda:</strong> ${roomName}</p>
            <p style="margin: 10px 0; color: #1e293b;"><strong>📅 Tarih:</strong> ${new Date(startTime).toLocaleDateString('tr-TR')}</p>
            <p style="margin: 10px 0; color: #1e293b;"><strong>⏰ Saat:</strong> ${new Date(startTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(endTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
            <p style="margin: 10px 0; color: #1e293b;"><strong>📌 Durum:</strong> ${statusText}</p>
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
    const adminEmail = process.env.EMAIL_USER;
    
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

export async function sendMaintenanceCancellationEmail(
  to: string,
  userName: string,
  roomName: string,
  startTime: string,
  endTime: string,
  refundAmount: number
) {
  try {
    const mailOptions = {
      from: `"DeskHere" <${process.env.EMAIL_USER}>`,
      to,
      subject: `🚨 ÖNEMLİ: Rezervasyon İptali ve Ücret İadesi (Bakım Nedeniyle)`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
          <h2 style="color: #b91c1c; text-align: center; border-bottom: 2px solid #fecaca; padding-bottom: 15px; margin-bottom: 30px;">
            Rezervasyon İptali ve İade Bilgilendirmesi
          </h2>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">Merhaba <strong>${userName}</strong>,</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            Üzülerek bildiririz ki; rezervasyon yaptığınız oda, tesisat/sistem arızası veya acil onarım gereksinimi sebebiyle <strong>zorunlu bakıma</strong> alınmıştır.
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            Bu teknik aksaklıktan ötürü aşağıdaki rezervasyonunuz sistem tarafından iptal edilmek zorunda kalınmıştır.
          </p>
          
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ef4444;">
            <p style="margin: 10px 0; color: #7f1d1d;"><strong>🏢 İptal Edilen Oda:</strong> ${roomName}</p>
            <p style="margin: 10px 0; color: #7f1d1d;"><strong>📅 Tarih:</strong> ${new Date(startTime).toLocaleDateString('tr-TR')}</p>
            <p style="margin: 10px 0; color: #7f1d1d;"><strong>⏰ Saat:</strong> ${new Date(startTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(endTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          
          <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; border: 1px solid #a7f3d0;">
            <h3 style="color: #065f46; margin: 0 0 10px 0;">Ücret İadeniz Yapıldı ✅</h3>
            <p style="color: #047857; margin: 0; font-size: 15px;">
              Ödemiş olduğunuz <strong>${refundAmount.toLocaleString('tr-TR')} ₺</strong> kartınıza iade edilmiştir. Bankanıza bağlı olarak 1-3 iş günü içerisinde hesabınıza yansıyacaktır.
            </p>
          </div>
          
          <p style="color: #475569; font-size: 15px; line-height: 1.5;">
            Yaşanan bu mağduriyet için özür dileriz. Dilerseniz sistem üzerinden farklı bir odaya yeni rezervasyon oluşturabilirsiniz.
          </p>
          
          <p style="color: #475569; font-size: 14px; text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            DeskHere Yönetimi
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Bakım İptal maili başarıyla gönderildi:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Bakım iptal maili gönderilemedi:", error);
    return { success: false, error: String(error) };
  }
}