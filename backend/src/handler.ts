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


function addCorsHeaders(response: Response, origin: string | null): Response {
  const envList = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

  const defaultOrigins = ['http://localhost:3001', 'http://localhost:3000'];
  const allowedOrigins = envList.length > 0 ? envList : defaultOrigins;

  const isVercelPreview = (o: string): boolean => /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(o);

  if (origin) {
    if (allowedOrigins.includes(origin) || isVercelPreview(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
  }

  if (!response.headers.get('Access-Control-Allow-Origin')) {
    response.headers.set('Access-Control-Allow-Origin', defaultOrigins[0]);
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
}


export async function GET(request: NextRequest) {
  const response = await handler(request);
  const origin = request.headers.get('origin');
  return addCorsHeaders(response, origin);
}


export async function POST(request: NextRequest) {
  const response = await handler(request);
  const origin = request.headers.get('origin');
  return addCorsHeaders(response, origin);
}


export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const response = new Response(null, { status: 200 });
  return addCorsHeaders(response, origin);
}
