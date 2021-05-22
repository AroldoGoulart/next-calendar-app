import api from './index'

// Request for Login in database
export async function LoginInApp(username, password) {
    const response = await api({
        method: "POST",
        url: "login",
        data: {
            username,
            password
        }
    })
    return response.data
}

// Request calendar
export async function CalendarEvents(year, id) {
    const response = await api({
        method: "POST",
        url: "calendar",
        data: {
            year,
            id
        }
    })
    return response.data
}

// Request events in calendar
export async function Events(id, data, table = "repair", type = "date") {
    const response = await api({
        method: "POST",
        url: "event",
        data: {
            id,
            data,
            type,
            table
        }
    })
    return response.data
}

// Request to search in all db
export async function SearchData(id, data) {
    const response = await api({
        method: "POST",
        url: "event",
        data: {
            id,
            data,
            type: "search"
        }
    })
    return response.data
}