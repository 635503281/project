export const databaseConfig = {
    provide: 'SEQUELIZE',
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
}

export const esConfig = {
    url: process.env.ES_URL
}