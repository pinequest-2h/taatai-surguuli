import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "./schemas";
import { NextRequest } from "next/server";
import resolvers from "./resolvers";
import { connectToDb } from "./database/connect-to-db";
import { Context } from "./types/context";
import { extractTokenFromHeader, verifyToken } from "./utils/jwt";


console.log("🔄 Starting database connection...");
connectToDb()
  .then(() => {
    console.log("✅ Database connection established");
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
  });

const server = new ApolloServer<Context>({
  resolvers,
  typeDefs,
  introspection: true,
});

export const handler = startServerAndCreateNextHandler<NextRequest, Context>(
  server,
  {
    context: async (req) => {
      let userId: string | undefined;

      try {
        const authHeader = req.headers.get("authorization");
        if (authHeader) {
          const token = extractTokenFromHeader(authHeader);
          const decoded = await verifyToken(token);
          userId = decoded.userId;
        }
      } catch (error) {
        console.warn("Authentication failed:", error);
      }

      return { req, userId };
    },
  }
);

// Add CORS headers
export async function GET(request: NextRequest) {
  const response = await handler(request);
  
  // Add CORS headers - specify exact origin instead of wildcard for credentials
  const origin = request.headers.get('origin');
  const allowedOrigins = ['http://localhost:3001', 'http://localhost:3000'];
  
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else {
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3001');
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  
  return response;
}

export async function POST(request: NextRequest) {
  const response = await handler(request);
  
  // Add CORS headers - specify exact origin instead of wildcard for credentials
  const origin = request.headers.get('origin');
  const allowedOrigins = ['http://localhost:3001', 'http://localhost:3000'];
  
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else {
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3001');
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  
  return response;
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins = ['http://localhost:3001', 'http://localhost:3000'];
  
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin && allowedOrigins.includes(origin) ? origin : 'http://localhost:3001',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
