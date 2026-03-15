import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js';
import { ClientSecretCredential } from '@azure/identity';

let graphClient = null;

if (process.env.MAIL_TENANT_ID && process.env.MAIL_CLIENT_ID && process.env.MAIL_CLIENT_SECRET) {
  const credential = new ClientSecretCredential(
    process.env.MAIL_TENANT_ID,
    process.env.MAIL_CLIENT_ID,
    process.env.MAIL_CLIENT_SECRET
  );

  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default'],
  });

  graphClient = Client.initWithMiddleware({ authProvider });
}

const sendEmail = async ({ to, subject, html }) => {
  if (!graphClient) {
    console.warn('⚠️  Email nao enviado: credenciais do Microsoft Graph nao configuradas.');
    return;
  }

  try {
    const normalizedTo = String(to).replace(/[\r\n]+/g, '').trim().toLowerCase();
    await graphClient.api(`/users/${process.env.MAIL_USER}/sendMail`).post({
      message: {
        subject,
        body: { contentType: 'HTML', content: html },
        toRecipients: [{ emailAddress: { address: normalizedTo } }],
      },
      saveToSentItems: true,
    });
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error.message);
    throw new Error(`Falha ao enviar o email: ${error.message}`);
  }
};

export default sendEmail;
