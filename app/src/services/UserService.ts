import { ApiClient } from "./Client"

export const CheckAuthMethod = async () => {
  return await ApiClient({
    url: '/user/check'
  })
}

export const LoginMethod = async (email: string, password: string) => {
  return await ApiClient({
    method: 'POST',
    url: '/user/login',
    data: {
      email: email,
      password: password
    }
  })
}

export const SingUpMethod = async (email: string, password: string) => {
  return await ApiClient({
    method: 'POST',
    url: '/user/signup',
    data: {
      email: email,
      password: password,
      role: 'USER'
    }
  })
}

export const GetProfileData = async () => {

}