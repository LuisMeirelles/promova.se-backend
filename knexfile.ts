import path from 'path';

const {
    DATABASE_HOST,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_NAME
} = process.env;

export default {
    development: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'mywordismypassword',
            database: 'promova_se'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations',
            directory:  path.join(path.dirname('./'), 'src', 'database', 'migrations')
        }
    },
    production: {
        client: 'mysql',
        connection: {
            host: DATABASE_HOST,
            user: DATABASE_USER,
            password: DATABASE_PASSWORD,
            database: DATABASE_NAME
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations',
            directory:  path.join(path.dirname('./'), 'src', 'database', 'migrations')
        }
    }
};
