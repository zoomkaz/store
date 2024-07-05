import axios from 'axios'

const testingAccount = 'EMscd6r9JnFiQ3bLoyjJY6eM78JrJceI';
const testingPassword = 'PjLZkKBHEiLK3YsjtNrt3TGNG0ahs3kG';

async function authorization() {
  try {
    const result = await axios.post('https://api.edu.cdek.ru/v2/oauth/token?parameters',
      {
        grant_type: 'client_credentials',
        client_id: testingAccount,
        client_secret: testingPassword,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
      }
    )
    return result
  } catch (e) {
    console.error(e)
  }
}

export default authorization;