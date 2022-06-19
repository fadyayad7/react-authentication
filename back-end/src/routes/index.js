import { testRoute } from './testRoute';
import { resetPassword, forgotPasswordRoute, loginRoute, signupRoute, updateUserInfoRoute, verifyEmailRoute } from './userRoutes';

export const routes = [
    signupRoute,
    loginRoute,
    verifyEmailRoute,
    updateUserInfoRoute,
    testRoute,
    forgotPasswordRoute,
    resetPassword
];
