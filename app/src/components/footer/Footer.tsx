import React from 'react'
import styles from './Footer.module.scss'
import Container from '../../UI/container/Container'
import telegram from '../../assets/messangers/telegram.svg'
import vk from '../../assets/messangers/vk.svg'
import whatsapp from '../../assets/messangers/whatsapp.svg'

const Footer = () => {

  const navItems = {
    "Интернет-магазин": ["Каталог", "Бренды"],
    "Компания": ["О компании", "Реквизиты", "Новости"],
    "Покупателям": ["Условия оплаты", "Условия доставки", "Гарантия и возврат"],
    "Помощь": ["Вопрос-ответ", "Гарантии безопасности платежа", "Сертификаты"],
  }

  return (
    <div className={styles.footer}>
      <Container>
        <div className={styles.footerContent}>
          <div className={styles.infoSide}>
            <p className={styles.title}>Контакты</p>
            <div className={styles.phone}><a href="tel:+7 777 777 77 77">+7 777 777 77 77</a></div>
            <div className={styles.email}><a href="mailto:example@example.ru">example@example.ru</a></div>
            <div className={styles.adress}>Москва, ул. Москва, д. 77</div>
            <div className={styles.graf}>Пн—Пт 10:00 – 18:00</div>
            <div className={styles.messangers}>
              <img src={telegram} alt="telegram" />
              <img src={vk} alt="vk" />
              <img src={whatsapp} alt="whatsapp" />
            </div>
          </div>
          <div className={styles.navSide}>
            {
              (Object.keys(navItems) as Array<keyof typeof navItems>).map((key, index) => {
                return <div className={styles.navItem} key={index}>
                  <p className={styles.title}>{key}</p>
                  {navItems[key].map((el, index) => <p className={styles.item} key={index}><a href="/">{el}</a></p>)}
                </div>
              })
            }
          </div>
        </div>
        <div className={styles.rules}>
          <p>© 2024 logo</p>
          <p>При использовании материалов сайта, прямая ссылка на источник обязательна.</p>
        </div>
      </Container>
    </div>
  )
}

export default Footer