// I was helped a lot by this SO thread:
// https://stackoverflow.com/questions/32545632/how-can-i-download-a-file-using-window-fetch

import { backendRootUrl } from '../global-variables';
import { getAPIToken } from './getAPIToken';

export function requestDocPDF(docId: string, docTitle: string): boolean {
  const token: string | null = getAPIToken();
  const apiPDFUrl = `${backendRootUrl}/editor-api/document/${docId}/pdf`;

  if (token === null) {
    return false;
  }

  const options = {
    headers: {
      'x-access-token': token
    }
  };

  fetch(apiPDFUrl, options)
    .then( (res: any) => res.blob() )
    .then( blob => {
      const fileURL = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = fileURL;
      a.setAttribute('download', `${docTitle}.pdf`);
      a.click();
    })
  return true;
}
