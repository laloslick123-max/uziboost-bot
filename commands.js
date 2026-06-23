import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';

export const commands = [
  new SlashCommandBuilder()
    .setName('setup-panel')
    .setDescription('Crea o actualiza el panel de tickets de UziBoost.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption((option) => option
      .setName('canal')
      .setDescription('Canal donde se publicará el panel de tickets.')
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true))
    .addChannelOption((option) => option
      .setName('categoria')
      .setDescription('Categoría donde se crearán los tickets.')
      .addChannelTypes(ChannelType.GuildCategory)
      .setRequired(false))
    .addRoleOption((option) => option
      .setName('staff_role')
      .setDescription('Rol que podrá ver y tomar tickets.')
      .setRequired(false))
    .addChannelOption((option) => option
      .setName('logs')
      .setDescription('Canal donde se mandarán transcripts y cierres.')
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(false)),

  new SlashCommandBuilder()
    .setName('faq-add')
    .setDescription('Agrega una respuesta automática personalizada.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((option) => option
      .setName('pregunta')
      .setDescription('Nombre corto de la respuesta, por ejemplo: Pago por Zelle.')
      .setMaxLength(80)
      .setRequired(true))
    .addStringOption((option) => option
      .setName('respuesta')
      .setDescription('Texto que responderá el bot.')
      .setMaxLength(1800)
      .setRequired(true))
    .addStringOption((option) => option
      .setName('keywords')
      .setDescription('Palabras clave separadas por coma. Ejemplo: zelle,pago,transferencia')
      .setMaxLength(500)
      .setRequired(false)),

  new SlashCommandBuilder()
    .setName('faq-list')
    .setDescription('Muestra las respuestas automáticas activas.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),



  new SlashCommandBuilder()
    .setName('config-uziboost')
    .setDescription('Configura links y precios que usará el bot en tickets.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((option) => option
      .setName('website')
      .setDescription('Página principal de UziBoost. Ejemplo: https://tusitio.com')
      .setMaxLength(300)
      .setRequired(false))
    .addStringOption((option) => option
      .setName('precios_url')
      .setDescription('Link directo a precios. Ejemplo: https://tusitio.com/#precios')
      .setMaxLength(300)
      .setRequired(false))
    .addStringOption((option) => option
      .setName('pagos_url')
      .setDescription('Link directo a pagos/checkout. Ejemplo: https://tusitio.com/#pagos')
      .setMaxLength(300)
      .setRequired(false))
    .addStringOption((option) => option
      .setName('precio_basico')
      .setDescription('Precio exacto del paquete básico. Ejemplo: $20 USD')
      .setMaxLength(80)
      .setRequired(false))
    .addStringOption((option) => option
      .setName('precio_intermedio')
      .setDescription('Precio exacto del paquete intermedio. Ejemplo: $35 USD')
      .setMaxLength(80)
      .setRequired(false))
    .addStringOption((option) => option
      .setName('precio_avanzado')
      .setDescription('Precio exacto del paquete avanzado. Ejemplo: $50 USD')
      .setMaxLength(80)
      .setRequired(false)),



  new SlashCommandBuilder()
    .setName('config-ai')
    .setDescription('Configura la IA conversacional del bot en tickets.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addBooleanOption((option) => option
      .setName('habilitado')
      .setDescription('Activa o desactiva la IA conversacional.')
      .setRequired(false))
    .addStringOption((option) => option
      .setName('modelo')
      .setDescription('Modelo de OpenAI. Recomendado: gpt-5.4-mini')
      .setMaxLength(80)
      .setRequired(false))
    .addIntegerOption((option) => option
      .setName('cooldown_segundos')
      .setDescription('Segundos mínimos entre respuestas de IA por ticket. Recomendado: 20')
      .setMinValue(5)
      .setMaxValue(3600)
      .setRequired(false))
    .addIntegerOption((option) => option
      .setName('max_tokens')
      .setDescription('Máximo de tokens de salida por respuesta. Recomendado: 450')
      .setMinValue(80)
      .setMaxValue(1200)
      .setRequired(false))
    .addBooleanOption((option) => option
      .setName('responder_tickets_tomados')
      .setDescription('Si está activado, la IA también responde cuando un staff ya tomó el ticket.')
      .setRequired(false))
    .addStringOption((option) => option
      .setName('instrucciones_extra')
      .setDescription('Reglas extra para la IA. Ejemplo: menciona CUPON20 si preguntan por descuento.')
      .setMaxLength(1000)
      .setRequired(false)),

  new SlashCommandBuilder()
    .setName('ticket-close')
    .setDescription('Cierra el ticket actual.')
    .addStringOption((option) => option
      .setName('razon')
      .setDescription('Razón del cierre.')
      .setMaxLength(300)
      .setRequired(false)),

  new SlashCommandBuilder()
    .setName('ticket-claim')
    .setDescription('Toma el ticket actual como staff.'),

  new SlashCommandBuilder()
    .setName('ticket-info')
    .setDescription('Muestra información del ticket actual.'),

  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Revisa si el bot está encendido.'),
];
