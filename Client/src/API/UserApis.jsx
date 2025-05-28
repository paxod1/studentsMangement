import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { basicRequest } from '../Axios/AxiosCreste';
import { LoginData } from '../Redux1/UserSlice';

// user login api call
export const loginUser = async (data, dispatch, navigate) => {
    try {
        const LoginInfo = await basicRequest.post("/student/login", data);
        toast.success("Login Successful!");
        dispatch(LoginData(LoginInfo.data));
    } catch (err) {
        console.log('Login error:', err);

        if (err.response) {
            if (err.response.status === 401) {
                toast.error("Invalid username or password.");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } else {
            toast.error("Network error. Please try again.");
        }
    }
};
