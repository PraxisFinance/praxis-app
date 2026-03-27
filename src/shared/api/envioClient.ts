const ENVIO_INDEXER_URL =
  process.env.NEXT_PUBLIC_ENVIO_INDEXER_URL ?? "http://localhost:8080/v1/graphql";

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function envioQuery<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(ENVIO_INDEXER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Envio indexer request failed: ${res.status} ${res.statusText}`);
  }

  const json: GraphQLResponse<T> = await res.json();

  if (json.errors?.length) {
    throw new Error(`Envio GraphQL error: ${json.errors.map((e) => e.message).join(", ")}`);
  }

  if (!json.data) {
    throw new Error("Envio indexer returned no data");
  }

  return json.data;
}

export function toBigInt(value: string | number | null | undefined): bigint {
  if (value == null) return BigInt(0);
  return BigInt(value);
}
