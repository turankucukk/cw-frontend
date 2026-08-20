import crypto from 'crypto';
const getSecret = () => {
  const secret = 'default_fallback_secret_key_12345';
  return crypto.createHash('sha256').update(secret).digest();
};
async function test() {
  const reservationId = 15;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', getSecret(), iv);
  let encrypted = cipher.update(reservationId.toString(), 'utf8', 'base64url');
  encrypted += cipher.final('base64url');
  const token = iv.toString('base64url') + '-' + encrypted;
  console.log('Token:', token);
  const parts = token.split('-');
  const iv2 = Buffer.from(parts[0], 'base64url');
  const decipher = crypto.createDecipheriv('aes-256-cbc', getSecret(), iv2);
  let decrypted = decipher.update(parts[1], 'base64url', 'utf8');
  decrypted += decipher.final('utf8');
  console.log('Decrypted:', parseInt(decrypted, 10));
}
test();
