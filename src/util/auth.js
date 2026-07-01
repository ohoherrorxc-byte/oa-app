import Cookies from 'js-cookie'
import {env} from "@/config/env";

const TokenKey = env.VUE_APP_TOKEN_KEY || 'saber-access-token'
const RefreshTokenKey = env.VUE_APP_REFRESH_TOKEN_KEY || 'saber-refresh-token'

export function getToken() {
    return Cookies.get(TokenKey)||localStorage.getItem('token')
}

export function setToken(token) {
    localStorage.setItem('token',token)
    return Cookies.set(TokenKey, token)
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

export function setRefreshToken(token) {
  return Cookies.set(RefreshTokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}

