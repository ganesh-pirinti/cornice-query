import { SOCIAL_LINKS } from './socialLinks';

/**
 * ==============================================================================
 * CORNICE & QUERY — OFFICIAL WHATSAPP CHANNEL CONFIGURATION
 * ==============================================================================
 * 
 * Official Cornice & Query WhatsApp Channel.
 * We use the official channel link to allow users to submit requirements safely
 * without exposing personal numbers or direct-chat phone links.
 */

export const WHATSAPP_CHANNEL_URL = SOCIAL_LINKS.whatsappChannel;

/**
 * Returns the official WhatsApp Channel URL for requirement submission.
 */
export function getWhatsAppChannelUrl(): string {
  return WHATSAPP_CHANNEL_URL;
}
