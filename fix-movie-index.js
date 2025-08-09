// Script to fix the movies collection index
// This script will drop the existing imdbId index and recreate it with sparse option

// Connect to your database
const dbName = process.env.MONGO_APP_DATABASE || 'hypertube';
db = db.getSiblingDB(dbName);

print('🔧 Fixing movies collection index...');

try {
  // Drop the existing index
  print('Dropping existing imdbId index...');
  db.movies.dropIndex({ imdbId: 1 });
  print('✅ Old index dropped');
  
  // Create new sparse index
  print('Creating new sparse index...');
  db.movies.createIndex({ imdbId: 1 }, { unique: true, sparse: true });
  print('✅ New sparse index created');
  
  print('🎉 Index fix completed successfully!');
} catch (error) {
  print('❌ Error fixing index:', error);
  throw error;
}
