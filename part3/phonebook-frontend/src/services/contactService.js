import axios from 'axios'
const baseUrl = 'api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const _delete = objectToDelete => {
  const url = `${baseUrl}/${objectToDelete.id}`
  return axios.delete(url)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const functions = {getAll, create, _delete, update}

export default functions