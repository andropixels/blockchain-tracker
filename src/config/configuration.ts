export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      name: process.env.DATABASE_NAME,
    },
    moralis: {
      apiKey: process.env.MORALIS_API_KEY,
    },
    email: {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
    },
  });