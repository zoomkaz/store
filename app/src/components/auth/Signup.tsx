import React, { useState } from 'react'
import styles from './Auth.module.scss'
import { withFormik, FormikProps, FormikErrors, Form, Field } from 'formik';
import { SingUpMethod } from '../../services/UserService';

interface FormValues {
  email: string;
  password: string;
  passwordConfirm: string;
}

interface OtherProps {
  message: string;
}

interface MyFormProps {
  initialEmail?: string;
  message: string; // if this passed all the way through you might do this or make a union type
}

interface SignupPropsType {
  setShowModal: (param: boolean) => void;
  setIsAuth: (param: boolean) => void;
  setCurrentAuthModal: (param: "login" | "signup") => void;
}

const Signup = ({ setShowModal, setCurrentAuthModal, setIsAuth }: SignupPropsType) => {
  const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {

    const { touched, errors, isSubmitting, message } = props;

    let error = false;
    if (errors.email || errors.password || errors.passwordConfirm || isSubmitting) {
      error = true
    }
    else {
      error = false
    }

    return (
      <Form className={styles.form}>
        <h1>{message}</h1>
        <h5>Зарегистрируйтесь, чтобы делать покупки, отслеживать заказы и пользоваться персональными скидками и баллами.</h5>
        <Field type="email" name="email" className={errors.email && styles.errorBorder} />
        {touched.email && errors.email && <div className={styles.error}>{errors.email}</div>}

        <Field type="password" name="password" className={errors.password && styles.errorBorder} />
        {touched.password && errors.password && <div className={styles.error}>{errors.password}</div>}

        <Field type="password" name="passwordConfirm" className={errors.passwordConfirm && styles.errorBorder} />
        {touched.passwordConfirm && errors.passwordConfirm && <div className={styles.error}>{errors.passwordConfirm}</div>}

        <button
          type="submit"
          className={error ? styles.btnNo : styles.btnOk}
          disabled={error}
        >
          Зарегистрироваться
        </button>
      </Form>
    );
  };

  const MyForm = withFormik<MyFormProps, FormValues>({
    // Transform outer props into form values
    mapPropsToValues: props => {
      return {
        email: props.initialEmail || '',
        password: '',
        passwordConfirm: '',
      };
    },

    // Add a custom validation function (this can be async too!)
    validate: (values: FormValues) => {
      let errors: FormikErrors<FormValues> = {};
      if (!values.email) {
        errors.email = 'Обязательно поле';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Неверный адрес электронной почты';
      } else if (!values.password) {
        errors.password = 'Обязательно поле';
      } else if (values.password.length <= 5) {
        errors.password = 'Пароль должен быть больше пяти символов';
      } else if (!values.passwordConfirm) {
        errors.passwordConfirm = 'Обязательно поле';
      } else if (values.passwordConfirm !== values.password) {
        errors.passwordConfirm = 'Пароли не совпадают';
      }
      return errors;
    },

    handleSubmit: values => {
      // do submitting things
      signUp(values.email, values.password)
    },
  })(InnerForm);

  const [errorMessage, setErrorMessage] = useState('')

  const signUp = async (email: string, password: string) => {
    const data = await SingUpMethod(email, password)
    if (data.status === 200) {
      const token = data.data.token
      localStorage.setItem('token', token)
      setIsAuth(true)
      setShowModal(false)
    } else {
      setErrorMessage(data.data ?? 'Что-то пошло не так')
      setTimeout(() => {
        setErrorMessage('')
      }, 2000);
    }
  }

  return (
    <div className={styles.loginModal}>
      <MyForm message='Регистрация' />
      <h4 className={styles.error} style={{ margin: '10px', textAlign: 'center' }}>{errorMessage}</h4>
      <h5 className={styles.regBtn} onClick={() => setCurrentAuthModal('login')}>Авторизация</h5>
    </div>
  )
}

export default Signup