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

  const defaultOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];
  const allowedOrigins = envList.length > 0 ? envList : defaultOrigins;

  const isVercelPreview = (o: string): boolean => {
    const vercelPattern = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;
    const isVercel = vercelPattern.test(o);
    console.log(`CORS: Checking Vercel pattern for ${o}: ${isVercel}`);
    return isVercel;
  };
  
  const isRenderPreview = (o: string): boolean => /^https:\/\/[a-z0-9-]+\.onrender\.com$/i.test(o);
  const isLocalhost = (o: string): boolean => /^http:\/\/localhost:\d+$/.test(o);

  console.log(`CORS: Received origin: ${origin}`);

  if (origin) {
    const isAllowed = allowedOrigins.includes(origin) || 
                     isVercelPreview(origin) || 
                     isRenderPreview(origin) || 
                     isLocalhost(origin);
    
    if (isAllowed) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      console.log(`CORS: ✅ Allowing origin ${origin}`);
    } else {
      // If origin is provided but not allowed, don't set any origin header
      console.warn(`CORS: ❌ Origin ${origin} not allowed. Allowed origins:`, allowedOrigins);
      console.warn(`CORS: Vercel check: ${isVercelPreview(origin)}, Render check: ${isRenderPreview(origin)}, Localhost check: ${isLocalhost(origin)}`);
    }
  } else {
    // In production, allow all origins if no origin is specified
    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Access-Control-Allow-Origin', '*');
      console.log('CORS: Production mode, allowing all origins');
    } else {
      response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
      console.log('CORS: No origin provided, defaulting to localhost:3000');
    }
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
