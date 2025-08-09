// MongoDB initialization script for Hypertube
print('🚀 Starting MongoDB initialization for Hypertube...');

// Get environment variables (with fallbacks)
const appUser = process.env.MONGO_APP_USER || 'hypertubeUser';
const appPassword = process.env.MONGO_APP_PASSWORD || 'appPass';
const appDatabase = process.env.MONGO_APP_DATABASE || 'hypertube';

print(`Setting up database: ${appDatabase} with user: ${appUser}`);

// Switch to the application database
db = db.getSiblingDB(appDatabase);

// Create the application user with comprehensive permissions
try {
  db.createUser({
    user: appUser,
    pwd: appPassword,
    roles: [
      {
        role: 'readWrite',
        db: appDatabase
      },
      {
        role: 'dbOwner',
        db: appDatabase
      }
    ]
  });
  print(`✅ User ${appUser} created successfully with readWrite and dbOwner roles`);
} catch (error) {
  if (error.code === 51003) {
    print(`ℹ️  User ${appUser} already exists`);
  } else {
    print('❌ Error creating user:', error);
    throw error;
  }
}

// Test authentication
try {
  db.auth(appUser, appPassword);
  print('✅ Authentication test successful');
  
    // Create indexes for better performance
  db.users.createIndex({ email: 1 }, { unique: true });
  db.users.createIndex({ createdAt: 1 });
  
  db.movies.createIndex({ title: 1 });
  db.movies.createIndex({ genre: 1 });
  db.movies.createIndex({ year: 1 });
  db.movies.createIndex({ imdbId: 1 });
  db.movies.createIndex({ createdAt: 1 });
  
  print('✅ Database indexes created');
  
  // Insert initialization marker
  db.system_info.insertOne({
    initialized: true,
    timestamp: new Date(),
    version: '1.0.0',
    user: appUser,
    database: appDatabase
  });
  
  print('✅ Database initialization completed successfully');
  
} catch (error) {
  print('❌ Authentication or setup failed:', error);
  throw error;
}

print('🎉 MongoDB is ready for Hypertube application!');