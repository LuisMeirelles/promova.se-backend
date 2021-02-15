import knex from 'knex';
import knexfile from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';

export default knex(environment === 'development' ? knexfile.development : knexfile.production);
