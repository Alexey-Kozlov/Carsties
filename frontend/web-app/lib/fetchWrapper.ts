import { getTokenWorkaround } from "@/app/actions/AuthActions";

const baseUrl = 'http://localhost:6001/';

const get = async (url: string) => {
    const requestOptions = {
        method: 'GET',
        headers: await getHeaders()
    }
    const response = await fetch(baseUrl + url, requestOptions);
    return await handleResponse(response);
}

const post = async (url: string, body: {}) => {
    const requestOptions = {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(body)
    }
    console.log(baseUrl + url);
    const response = await fetch(baseUrl + url, requestOptions);
    return await handleResponse(response);
}

const put = async (url: string, body: {}) => {
    const requestOptions = {
        method: 'PUT',
        headers: await getHeaders(),
        body: JSON.stringify(body)
    }
    const response = await fetch(baseUrl + url, requestOptions);
    return await handleResponse(response);
}

const del = async (url: string) => {
    const requestOptions = {
        method: 'DELETE',
        headers: await getHeaders()
    }
    const response = await fetch(baseUrl + url, requestOptions);
    return await handleResponse(response);
}

const getHeaders = async() =>{
    const token = await getTokenWorkaround();
    const headers: any = {'Content-Type': 'application/json'};
    if(token){
        headers.Authorization = 'Bearer '  + token?.access_token;
    }
    return headers;
}


const handleResponse = async (response: Response) => {
    const text = await response.text();
    const data = text && JSON.parse(text);

    if(response.ok) return data || response.statusText;
    
    const error = {
        status: response.status,
        message: response.statusText    
    }
    console.log(error);
    return {error};
}

export const fetchWrapper = {
    get, post, put, del
}

