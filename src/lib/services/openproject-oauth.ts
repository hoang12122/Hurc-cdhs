import type { NextApiRequest, NextApiResponse } from 'next';
// Using the built‑in fetch API available in Node 18+ (no external dependency)
import querystring from 'querystring';

/**
 * OpenProject OAuth2 helper service.
 * It provides functions to initiate the auth flow, exchange the authorization
 * code for an access token, refresh tokens and retrieve the stored token for a
 * given user.
 *
 * For simplicity we store the token in an HttpOnly cookie. In a real
 * production app you would likely store it in a server‑side session store or a
 * secure database.
 */

const CLIENT_ID = process.env.OPENPROJECT_OAUTH_CLIENT_ID || '';
const CLIENT_SECRET = process.env.OPENPROJECT_OAUTH_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.OPENPROJECT_OAUTH_REDIRECT_URI || '';
const AUTH_BASE_URL = process.env.OPENPROJECT_BASE_URL?.replace(/\/api\/v3$/, '') || '';

/**
 * Build the URL the user must visit to authorize the app.
 */
export function getAuthorizationUrl(state: string): string {
  const params = querystring.stringify({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    state,
    scope: 'api_v3',
  });
  return `${AUTH_BASE_URL}/oauth/authorize?${params}`;
}

/**
 * Exchange an authorization code for an access token.
 */
export async function exchangeCodeForToken(code: string): Promise<any> {
  const tokenUrl = `${AUTH_BASE_URL}/oauth/token`;
  const body = querystring.stringify({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token exchange failed: ${err}`);
  }
  return res.json();
}

/**
 * Refresh an expired access token.
 */
export async function refreshAccessToken(refreshToken: string): Promise<any> {
  const tokenUrl = `${AUTH_BASE_URL}/oauth/token`;
  const body = querystring.stringify({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token refresh failed: ${err}`);
  }
  return res.json();
}

/**
 * Middleware to ensure a request is authenticated with a valid OpenProject token.
 * It expects the token to be stored in an HttpOnly cookie named `op_token`.
 */
export async function ensureAuthenticated(req: NextApiRequest, res: NextApiResponse) {
  const tokenCookie = req.cookies?.op_token;
  if (!tokenCookie) {
    const state = Buffer.from(JSON.stringify({ redirect: req.url })).toString('base64');
    const authUrl = getAuthorizationUrl(state);
    return res.redirect(authUrl);
  }
  (req as any).openProjectAccessToken = tokenCookie;
  // Continue processing; callers can proceed after this call.
}

/**
 * Retrieve the stored access token for a given user ID.
 * For this simplified example we read it from the cookie, but a real app would
 * look it up in a session store or database.
 */
export function getAccessToken(req: NextApiRequest): string | undefined {
  return req.cookies?.op_token;
}

/**
 * Helper to set the token cookie after a successful OAuth callback.
 */
export function setTokenCookie(res: NextApiResponse, token: string) {
  const cookie = `op_token=${token}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
  res.setHeader('Set-Cookie', cookie);
}
