import { connect } from 'mongoose';
 
export const connectToDb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }
 
    await connect(process.env.MONGO_URI);
  } catch (error) {
    throw error;
  }
};
 
