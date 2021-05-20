import api from './index'

import axios from "axios"
export async function LoginInApp(username, password) {

    console.log(username, password)
    const response = await api({
        method: "POST",
        url: "login",
        data: {
            username,
            password
        }
    })
    console.log(response)
    return response.data
}