const axios = require('axios');

async function sendSMS() {
  const username = 'sandbox'; // Use 'sandbox' for testing
  const apiKey =
    'atsk_0e9b2fbba3b063ac8cde8287370abf2e7d96ef3a86f795684cc5d7f7643b573828cae755';
  const url = 'https://api.africastalking.com/version1/messaging';

  try {
    const response = await axios.post(
      url,
      new URLSearchParams({
        username: username,
        to: '+254714861813',
        message: 'Hello, this is a test message!',
      }),
      {
        headers: {
          apiKey: apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      }
    );

    console.log('Message sent:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

sendSMS();
