import { basicRequest } from '../AxiosCreate';
import { LoginData } from '../Redux/UserSlice'


export const loginUser = async (data, dispatch, navigate) => {
    try {
        console.log(data);

        const LoginInfo = await basicRequest.post("/student/login", data)
        console.log(LoginInfo.data.token)
        dispatch(LoginData(LoginInfo.data))
        await setTimeout(() => {
            window.location.reload();
        }, 500);


    } catch (err) {
        console.log(err)
    }
}
