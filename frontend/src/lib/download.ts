/**
 * Browser file download utility using fetch with error handling and Content-Disposition support.
 * Does not depend on external libraries.
 */
export async function downloadFile(url: string, fallbackFilename: string): Promise<void> {
  const response = await fetch(url);

  if (!response.ok) {
    let errorMessage = `Export failed (${response.status}: ${response.statusText || 'Error'})`;
    try {
      const errorJson = await response.json();
      if (errorJson && typeof errorJson === 'object') {
        if (typeof errorJson.detail === 'string') {
          errorMessage = errorJson.detail;
        } else if (Array.isArray(errorJson.detail)) {
          errorMessage = errorJson.detail
            .map((d: { msg?: string }) => d.msg || JSON.stringify(d))
            .join('; ');
        } else if (errorJson.message) {
          errorMessage = errorJson.message;
        }
      }
    } catch {
      // Body wasn't JSON or could not be parsed
    }
    throw new Error(errorMessage);
  }

  // Parse filename from Content-Disposition header if available
  let filename = fallbackFilename;
  const disposition = response.headers.get('Content-Disposition') || response.headers.get('content-disposition');
  if (disposition) {
    const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match && utf8Match[1]) {
      try {
        filename = decodeURIComponent(utf8Match[1]);
      } catch {
        filename = utf8Match[1];
      }
    } else {
      const match = disposition.match(/filename=(?:["']?)([^"';]+)(?:["']?)/i);
      if (match && match[1]) {
        filename = match[1].trim();
      }
    }
  }

  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  try {
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    window.URL.revokeObjectURL(objectUrl);
  }
}
