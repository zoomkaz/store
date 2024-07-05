import React, { useState } from 'react'
import styles from './Auth.module.scss'
import { withFormik, FormikProps, FormikErrors, Form, Field } from 'formik';
import { LoginMethod } from '../../services/UserService';

interface FormValues {
  email: string;
  password: string;
}

interface OtherProps {
  message: string;
}

interface MyFormProps {
  initialEmail?: string;
  message: string; // if this passed all the way through you might do this or make a union type
}

interface LoginPropsType {
  setShowModal: (param: boolean) => void;
  setIsAuth: (param: boolean) => void;
  setCurrentAuthModal: (param: "login" | "signup") => void;
}

const Login = ({ setShowModal, setCurrentAuthModal, setIsAuth }: LoginPropsType) => {
  const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {

    const { touched, errors, isSubmitting, message } = props;

    let error = false;
    if (errors.email || errors.password || isSubmitting) {
      error = true
    }
    else {
      error = false
    }

    return (
      <Form className={styles.form}>
        <h1>{message}</h1>
        <h5>Авторизируйтесь, чтобы делать покупки, отслеживать заказы и пользоваться персональными скидками и баллами.</h5>
        <Field type="email" name="email" className={errors.email && styles.errorBorder} />
        {touched.email && errors.email && <div className={styles.error}>{errors.email}</div>}

        <Field type="password" name="password" className={errors.password && styles.errorBorder} />
        {touched.password && errors.password && <div className={styles.error}>{errors.password}</div>}

        <button
          type="submit"
          className={error ? styles.btnNo : styles.btnOk}
          disabled={error}
        >
          Вход
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
      }
      return errors;
    },

    handleSubmit: values => {
      // do submitting things
      logIn(values.email, values.password)
    },
  })(InnerForm);

  const [errorMessage, setErrorMessage] = useState('')

  const logIn = async (email: string, password: string) => {
    const data = await LoginMethod(email, password)
    if (data.status === 200) {
      const token = data.data.token
      localStorage.setItem('token', token)
      setIsAuth(true)
      setShowModal(false)
    } else if (data.data === 'столбец "created_at" не существует') {
      setErrorMessage('Пользователя с таким email не существует')
      setTimeout(() => {
        setErrorMessage('')
      }, 2000);
    } else {
      setErrorMessage(data.data ?? 'ЧТо-то пошло не так')
      setTimeout(() => {
        setErrorMessage('')
      }, 2000);
    }
  }

  return (
    <div className={styles.loginModal}>
      <MyForm message='Авторизация' />
      <h4 className={styles.error} style={{ margin: '10px', textAlign: 'center' }}>{errorMessage}</h4>
      <h5 className={styles.regBtn} onClick={() => setCurrentAuthModal('signup')}>Регистрация</h5>
    </div>
  )
}

export default Login