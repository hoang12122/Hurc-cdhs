/**
 * Public user service facade.
 *
 * Implementations are split by responsibility under ./user so existing imports
 * remain compatible while each TypeScript module stays within the design limit.
 */
export {
  verifyInternalCredentials,
  getInternalUsers,
  createInternalUser,
  updateInternalUser,
  deleteInternalUser,
  getInternalUserByEmail,
  getInternalUserById,
} from './user/core';

export {
  validatePassword,
  generateRandomPassword,
  updateUserPassword,
} from './user/password';

export {
  getInternalPasswordResetRequests,
  createInternalPasswordResetRequest,
  updateInternalPasswordResetRequest,
} from './user/password-reset';

export {
  getInternalRoles,
  createInternalRole,
  updateInternalRole,
  deleteInternalRole,
} from './user/roles';
