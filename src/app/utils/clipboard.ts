export function copyToClipboard(text: string): Promise<boolean> {
  // Fallback method using textarea
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);

  try {
    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile devices
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return Promise.resolve(successful);
  } catch (err) {
    document.body.removeChild(textarea);
    return Promise.resolve(false);
  }
}
