import axios from "axios"


export class Api {

    private static getToken = () => localStorage.getItem('token');

    private static getAuthHeader = () => ({ Authorization: `Bearer ${this.getToken()}` })

    public static signup = async (params: {}) => {
        return axios.post('/api/signup', {...params});
    }
    
    public static login = async (params: {}) => {
        return axios.post('/api/login', {...params});
    }

    public static updateUserInfo = async (userId: string, params: {}) => {
        return axios.put(`/api/users/${userId}`, {...params}, {headers: this.getAuthHeader()})
    }

    public static verifyEmail = async (params: {verificationString: string}) => {
        return axios.put(`/api/users/verify-email`, {...params});
    }

    public static forgotPassword = async (email: string) => {
        return axios.put(`/api/forgot-password/${email}`);
    }
    
    public static resetPassword = async (passwordResetCode: string, params: {}) => {
        return axios.put(`/api/users/${passwordResetCode}/reset-password`, {...params});
    }

    public static getGoogleOauthUrl = async () => {
        return axios.get('/auth/google/url');
    }
}