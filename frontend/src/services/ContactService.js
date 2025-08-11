import axios from 'axios'

const baseUrl = "/api/persons"

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(resp => resp.data)
}

const create = newContact => {
    const request = axios.post(baseUrl, newContact)
    return request.then(resp => resp.data)
}

const update = (id, updatedContact) => {
    const request = axios.put(`${baseUrl}/${id}`, updatedContact)
    return request.then(resp => resp.data)
}

const remove = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(resp => resp.data)
}

export default {getAll, create, update, remove}