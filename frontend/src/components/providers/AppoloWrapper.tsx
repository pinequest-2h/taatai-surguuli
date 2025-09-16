"use client";

import { PropsWithChildren } from "react";
import { ApolloProvider } from '@apollo/client/react';
import client from '@/lib/apollo-client';

export const ApolloWrapper = ({ children }: PropsWithChildren) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
};
