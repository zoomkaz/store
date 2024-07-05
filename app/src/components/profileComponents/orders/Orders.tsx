import React, { useEffect, useState } from 'react'
import styles from './Orders.module.scss'
import { IOrder } from '../../../types/types'
import { GetAllOrdersMethod } from '../../../services/OrderService'
import { addSpace } from '../../../func/addSpace'

const Orders = () => {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [activeOrder, setActiveOrder] = useState(0)

  const getAllOrders = async () => {
    const data = await GetAllOrdersMethod()
    if (data.status === 200) {
      setOrders(data.data)
    }
  }

  useEffect(() => {
    getAllOrders()
  }, [])


  return (
    <div className={styles.ordersContainer}>
      <div className={styles.listHead}>
        <div className={styles.headItem}>Номер</div>
        <div className={styles.headItem}>Дата заказа</div>
        <div className={styles.headItem}>Статус</div>
      </div>
      <p className={styles.hint}>Клик на заказ для просмотра деталей</p>
      {orders.length ?
        orders.map((order, index) => {
          return <div className={styles.order} key={index}>
            <div className={styles.short} onClick={() => setActiveOrder(activeOrder === order.id ? 0 : order.id)}>
              <p>Заказ № {order.id}</p>
              <p>{new Date(Date.parse(order.createdAt)).toLocaleString()}</p>
              <p>{order.status === 0 ? 'Оформлен' : 'В пути'}</p>
            </div>
            {
              activeOrder === order.id ?
                <div className={styles.orderInfo}>
                  <div className={styles.infoSide}>
                    <h3>Детали заказа</h3>
                    <div className={styles.infoBox}>
                      <p>Способ получения</p>
                      <p>{order.deliweryWay === 'courier' ? 'Курьером' : order.deliweryWay === 'mail' ? 'Почта' : 'Самовывоз'}</p>
                    </div>
                    <div className={styles.infoBox}>
                      <p>Адрес доставки</p>
                      <p>{order.address}</p>
                    </div>
                    <div className={styles.infoBox}>
                      <p>Способ оплаты</p>
                      <p>{order.payOption === 'online' ? 'Оплачено на сайте' : 'Наличными или картой при получении'}</p>
                    </div>
                    {
                      order.comment &&
                      <div className={styles.infoBox}>
                        <p>Комментарий к заказу</p>
                        <p>{order.comment}</p>
                      </div>
                    }
                    <div className={styles.infoBox}>
                      <p>Количество товаров</p>
                      <p>{order.items.reduce((a, b) => a + +b.quantity, 0)}</p>
                    </div>
                    <div className={styles.infoBox}>
                      <p>Доставка</p>
                      <p>{order.deliweryWay === 'courier' ? '500 ₽' : order.deliweryWay === 'mail' ? 'Бесплатно' : '300 ₽'}</p>
                    </div>
                    <div className={styles.infoBox}>
                      <p>Общая сумма</p>
                      <p>{+order.amount + (order.deliweryWay === 'courier' ? 500 : order.deliweryWay === 'mail' ? 0 : 300)} ₽</p>
                    </div>
                  </div>
                  <div className={styles.itemsSide}>
                    <h3>Товары</h3>
                    {
                      order.items.map((item, index) => {
                        return <div className={styles.item} key={index}>
                          <div className={styles.imageSide}>
                            <img src={`${process.env.REACT_APP_IMG_URL}${item.image}`} alt="product" />
                          </div>
                          <div className={styles.descSide}>
                            <div className={styles.top}>
                              <p className={styles.name}>{item.name}</p>
                              <p className={styles.name}>{item.quantity} шт.</p>
                            </div>
                            <div className={styles.bottom}>
                              <span>{addSpace((item.price).toString())} ₽ / шт.</span>
                              <p>{addSpace((+item.price * +item.quantity).toString())} ₽</p>
                            </div>
                          </div>
                        </div>
                      })
                    }
                  </div>
                </div>
                : <></>
            }
          </div>
        })
        : <div>У вас ещё нет заказов</div>
      }
    </div>
  )
}

export default Orders