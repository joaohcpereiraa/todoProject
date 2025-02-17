// filepath: /c:/Projetos/LAPR5_3DC_G15/Node-Api/config.js
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

let databaseURL = process.env.MONGODB_URI || "mongodb://mongoadmin:cd5b278f495dbfc676d9c2b3@vs217.dei.isep.ipp.pt:27017/admin";

const getDatabaseURL = async () => {
  if (process.env.NODE_ENV === 'test') {
    const mongoServer = await MongoMemoryServer.create();
    return mongoServer.getUri();
  }
  return databaseURL;
};

const config = {
  /**
   * Your favorite port : optional change to 4000 by JRT
   */
  port: parseInt(process.env.PORT, 10) || 4000,

  /**
   * That long string from mlab
   */
  databaseURL: databaseURL,

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "your-very-secure-key-that-is-at-least-256-bits-long",

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {
    task: {
        name: "TaskController",
        path: "../controllers/taskController"
    }
  },

  repos: {
    task: {
        name: "TaskRepo",
        path: "../repos/taskRepo"
    }
},

  services: {
    task: {
        name: "TaskService",
        path: "../services/taskService"
    }
    
  },
};

export default config;