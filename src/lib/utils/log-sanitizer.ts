/**
 * LOG SANITIZER (HURC1 SECURITY)
 * Strips dangerous ANSI escape sequences and control characters from user data.
 */

export function sanitizeLogMessage(message: string): string {
    // 1. Strip ANSI escape codes (prevent log injection/hiding)
    // eslint-disable-next-line no-control-regex
    const ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
    let sanitized = message.replace(ansiRegex, '');

    // 2. Strip non-printable control characters except newline/tab
    // eslint-disable-next-line no-control-regex
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    return sanitized;
}
