const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'concertdb',
});

async function updateRemainSeat() {
  try {
    console.log('Connecting to database...');
    
    // Get all concerts
    const result = await pool.query('SELECT id, name, seat, remain_seat FROM concert');
    const concerts = result.rows;
    
    console.log(`Found ${concerts.length} concerts`);
    
    for (const concert of concerts) {
      // If remain_seat is null or undefined, set it to seat value
      if (concert.remain_seat === null || concert.remain_seat === undefined) {
        await pool.query(
          'UPDATE concert SET remain_seat = $1 WHERE id = $2',
          [concert.seat, concert.id]
        );
        console.log(`Updated concert "${concert.name}": remain_seat = ${concert.seat}`);
      } else {
        console.log(`Concert "${concert.name}" already has remain_seat = ${concert.remain_seat}`);
      }
    }
    
    console.log('Update completed successfully!');
  } catch (error) {
    console.error('Error updating remain_seat:', error);
  } finally {
    await pool.end();
  }
}

updateRemainSeat(); 