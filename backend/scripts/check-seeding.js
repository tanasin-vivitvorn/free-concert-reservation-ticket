const { Client } = require('pg');

async function checkSeeding() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'postgres',
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'concertdb',
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check users
    const usersResult = await client.query('SELECT COUNT(*) as count FROM "user"');
    console.log(`Users count: ${usersResult.rows[0].count}`);

    // Check concerts
    const concertsResult = await client.query('SELECT COUNT(*) as count FROM concert');
    console.log(`Concerts count: ${concertsResult.rows[0].count}`);

    // Show user details
    const userDetails = await client.query('SELECT username, email, role FROM "user"');
    console.log('Users:', userDetails.rows);

    // Show concert details
    const concertDetails = await client.query('SELECT name, seat, date FROM concert');
    console.log('Concerts:', concertDetails.rows);

  } catch (error) {
    console.error('Error checking seeding:', error);
  } finally {
    await client.end();
  }
}

checkSeeding(); 