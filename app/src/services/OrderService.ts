import { ApiClient } from "./Client"

export const GetAllOrdersMethod = async () => {
  return await ApiClient({
    url: "/order/user/getall"
  })
}

export const CreateOrderMethod = async (
  type: 'user' | 'guest' | 'admin',
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  address: string,
  deliweryWay: 'courier' | 'mail' | 'pickup',
  payOption: 'online' | 'cardOrCash',
  confirm: boolean,
  comment: string,
) => {
  return await ApiClient({
    url: type === 'user' ? '/order/user/create' : type === 'guest' ? '/order/guest/create' : '/order/admin/create',
    method: "POST",
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      address: address,
      deliweryWay: deliweryWay,
      payOption: payOption,
      confirm: confirm,
      comment: comment,
    }
  })
}