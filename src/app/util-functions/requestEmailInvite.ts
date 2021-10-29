// I was helped a lot by this SO thread:
// https://stackoverflow.com/questions/32545632/how-can-i-download-a-file-using-window-fetch

import { backendRootUrl } from '../global-variables';
import { InvalidEmailError, MissingTokenError, RequestFailedError } from './custom-errors';
import { getAPIToken } from './getAPIToken';

function isValidEmail(
  arg: any
): boolean {
  if (typeof arg !== 'string') {
      return false;
  }
  if (!/[^@]+@[^@.]+\.[^@.]+/.test(arg)) {
      return false;
  }
  return true;
}

export async function requestEmailInvite(docId: string, inviteeEmail: string): Promise<boolean> {
  if (!isValidEmail(inviteeEmail)) {
    throw new InvalidEmailError('email formatting is incorrect');
  }

  const token: string | null = getAPIToken();
  const apiInviteUrl = `${backendRootUrl}/editor-api/document/${docId}/invite-editor`;

  if (token === null) {
    throw new MissingTokenError('user token is invalid');
  }

  const options = {
    method: 'POST',
    mode: 'cors' as RequestMode,
    headers: {
      'x-access-token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'invitee_email': inviteeEmail
    })
  };

  await fetch(apiInviteUrl, options)
    .then( (resp) => {
      console.log(resp);
    } )
    .catch( () => { throw new RequestFailedError('Server did not respond.'); })
  return true;
}
