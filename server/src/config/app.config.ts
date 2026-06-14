export const appConfig = () => {
  return {
    environment: process.env.NODE_ENV || 'production',
    // database: {
    //   type: process.env.DB_TYPE || 'postgres',
    //   host: process.env.DB_HOST || 'localhost',
    //   port: parseInt(process.env.DB_PORT || '5432'),
    //   name: process.env.DB_NAME,
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   synchronize: process.env.DB_SYNCHRONIZE === 'true' ? true : false,
    //   autoLoadEntities:
    //     process.env.DB_AUTO_LOAD_ENTITIES === 'true' ? true : false,
    // },
  };
};
