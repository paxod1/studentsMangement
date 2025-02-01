import { basicRequest } from '../AxiosCreate';
import { LoginData } from '../Redux/UserSlice'


export const loginUser = async (data, dispatch) => {
    try {
        console.log(data);

        const LoginInfo = await basicRequest.post("/student/login", data)
        console.log(LoginInfo.data.token)
        alert(LoginInfo.message)
        dispatch(LoginData(LoginInfo.data))

    } catch (err) {
        console.log(err)
    }
}
