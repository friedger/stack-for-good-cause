import { createClient, Client } from "@stacks/blockchain-api-client";
import { paths } from "@stacks/blockchain-api-client/lib/generated/schema";
import { useCallback, useRef } from "react";

/**
 * Hook that provides a lazily-created Stacks blockchain API client
 * The client is only created when first needed and reused across calls
 */
export const useApiClient = () => {
  const apiClientRef = useRef<Client<paths> | null>(null);

  const getApiClient = useCallback(() => {
    if (!apiClientRef.current) {
      apiClientRef.current = createClient();
    }
    return apiClientRef.current;
  }, []);

  return {
    getApiClient,
    // Helper to check if client is initialized
    isInitialized: !!apiClientRef.current,
  };
};
