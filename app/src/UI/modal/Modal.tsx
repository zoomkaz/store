import React, { useEffect } from 'react'
import styles from './Modal.module.scss'
import close from '../../assets/icons/close.svg'

interface ModalProps {
  children: string | JSX.Element | JSX.Element[];
  className?: string;
  setShowModal: (param: boolean) => void;
  showModal: boolean;
}

const Modal = ({ children, className, showModal, setShowModal }: ModalProps) => {

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showModal])

  return <>
    {showModal &&
      <div className={styles.mainModal}>
        <div className={styles.modalBack} onMouseDown={() => setShowModal(false)}>

        </div>
        <div className={`${styles.modal} ${className}`} onClick={(e) => e.stopPropagation()}>
          <img src={close} alt="close" className={styles.close} onClick={() => setShowModal(false)} />
          {children}
        </div>
      </div>
    }
  </>
}

export default Modal