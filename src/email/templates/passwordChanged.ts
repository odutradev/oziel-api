const passwordChangedTemplate = (): string => {
    return `
# Senha Alterada com Sucesso

Olá **{{userName}}**,

Sua senha foi alterada com sucesso.

## Detalhes da alteração:

- **Data:** {{date}}
- **Horário:** {{time}}

---

Se você não reconhece esta alteração, entre em contato conosco imediatamente.

Atenciosamente,  
**Bonfire**
    `.trim();
};

export default passwordChangedTemplate;