import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "./schemas";
import { NextRequest } from "next/server";
import resolvers from "./resolvers";
import { connectToDb } from "./database/connect-to-db";
import { Context } from "./types/context";
import { extractTokenFromHeader, verifyToken } from "./utils/jwt";
import { createDataLoaders } from "./utils/dataloaders";

connectToDb()
  .then(() => {
  })
  .catch(() => {
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
      } catch {
      }

      const dataLoaders = createDataLoaders();

      return { req, userId, dataLoaders };
    },
  }
);

function addCorsHeaders(response: Response, origin: string | null): Response {

  const envList = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const defaultOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ];

  const allowedOrigins = envList.length > 0 ? envList : defaultOrigins;

  const isVercelPreview = (o: string): boolean =>
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(o);

  const isRenderPreview = (o: string): boolean =>
    /^https:\/\/[a-z0-9-]+\.onrender\.com$/i.test(o);

  const isLocalhost = (o: string): boolean =>
    /^http:\/\/localhost:\d+$/.test(o);


  if (origin) {
    const isAllowed =
      allowedOrigins.includes(origin) ||
      isVercelPreview(origin) ||
      isRenderPreview(origin) ||
      isLocalhost(origin);

    if (isAllowed) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    } else {
    }
  } else {
    if (process.env.NODE_ENV === "production") {
      response.headers.set(
        "Access-Control-Allow-Origin",
        "https://tuhlag-orchin-eruul-setgel.vercel.app"
      );
    } else {
      response.headers.set(
        "Access-Control-Allow-Origin",
        "http://localhost:3000"
      );
    }
  }

  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Max-Age", "86400");

  return response;
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const response = await handler(request);
  const duration = Date.now() - startTime;

  if (duration > 1000) {
  }

  const origin = request.headers.get("origin");
  return addCorsHeaders(response, origin);
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const response = await handler(request);
  const duration = Date.now() - startTime;

  if (duration > 1000) {
  }

  const origin = request.headers.get("origin");
  return addCorsHeaders(response, origin);
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  const response = new Response(null, { status: 200 });
  return addCorsHeaders(response, origin);
}
