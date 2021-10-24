// based on https://developer.mozilla.org/docs/Web/API/Document/cookie

export function getAPIToken(): string | null {
    let token: string | null = null;

    const tokenRow: string | undefined = document.cookie
    .split('; ')
    .find(row => row.startsWith('editor-api-token'))

    if (tokenRow) {
        token = tokenRow.split('=')[1];
    }

    return token;
}
