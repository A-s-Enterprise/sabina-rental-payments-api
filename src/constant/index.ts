// Provider token for S3 Client
const S3_CLIENT = 'S3_CLIENT';

// Allowed methods for the API
const METHODS_ALLOWED = ['GET', 'POST', 'PUT', 'DELETE'];

// Refresh Token Expiration in Seconds
// 1 week (60 * 60 * 24 * 7) = 604,800
const REFRESH_TOKEN_EXPIRATION = 604_800;

export { S3_CLIENT, METHODS_ALLOWED, REFRESH_TOKEN_EXPIRATION };
