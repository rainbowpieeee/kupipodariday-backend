export default () => ({
	JWT_SECRET: process.env.JWT_SECRET,
  port: parseInt(process.env.PORT) || 3001,
  db: {
    type: "postgres",
    host: 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    username: 'student',
    password: '152637',
    database: 'kupipodariday',
  }   
  });