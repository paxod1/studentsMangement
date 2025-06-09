

import { decode } from 'html-entities';

// ✅ Helper to remove HTML tags (used for word trimming)
function stripTags(html) {
  return html.replace(/<[^>]*>/g, '');
}

// ✅ Clean and decode broken characters, emojis, and symbols
export function cleanHtml(text) {
  if (!text) return '';
  return decode(
    text
           // Smart punctuation
      .replace(/â€™/g, '’')    // right single quote
      .replace(/â€œ/g, '“')    // left double quote
      .replace(/â€�/g, '”')    // right double quote
      .replace(/â€“/g, '–')    // en dash
      .replace(/â€”/g, '—')    // em dash
      .replace(/â€¦/g, '…')    // ellipsis
      .replace(/â€˜/g, '‘')    // left single quote
      .replace(/â€/g, '€')     // euro sign

      // Common HTML entities
      .replace(/â„¢/g, '™')
      .replace(/â©/g, '©')
      .replace(/â®/g, '®')

      // Common emoji encodings
      .replace(/ðŸŽ¥/g, '🎥')
      .replace(/ðŸ”¥/g, '🔥')
      .replace(/ðŸ‘/g, '👍')
      .replace(/ðŸ˜€/g, '😊')
      .replace(/ðŸ‘¨‍ðŸ’./g, '👨‍💻')
      .replace(/ðŸŒŸ/g, '🌟')
      .replace(/ðŸ‘Œ/g, '👌')
      .replace(/ðŸ¤—/g, '🤗')
      .replace(/ðŸ˜ˆ/g, '😍')
      .replace(/ðŸ’ª/g, '💪')
      .replace(/ðŸ’–/g, '💖')
      .replace(/ðŸ¤£/g, '🤣')
      .replace(/ðŸ¤”/g, '🤔')

      // Fallback fix for weird characters
      .replace(/\uFFFD/g, '') // remove � chars (unknown character)
  );
}


export function getShortHtml(text, wordLimit = 30) {
  const cleaned = cleanHtml(text);
  const noHtml = stripTags(cleaned);
  const words = noHtml.split(/\s+/).slice(0, wordLimit).join(' ');
  return `${words}...`;
}

export function getShortHtmlLength(text, wordLimit = 60) {
  const cleaned = cleanHtml(text);
  const noHtml = stripTags(cleaned);
  const words = noHtml.split(/\s+/).slice(0, wordLimit).join(' ');
  return `${words}...`;
}