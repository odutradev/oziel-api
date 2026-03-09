const passwordResetTemplate = (): string => {
    return `
# Redefinição de Senha

Olá,

Você solicitou a redefinição de senha da sua conta.

## Seu código de verificação é:

**{{code}}**

Este código expira em **{{expirationMinutes}} minutos**.

---

Se você não solicitou esta redefinição, ignore este email.

Atenciosamente,  
**Bonfire**
    `.trim();
};

export default passwordResetTemplate;