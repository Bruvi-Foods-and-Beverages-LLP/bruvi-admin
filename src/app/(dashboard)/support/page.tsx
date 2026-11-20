import { redirect } from "next/navigation";

/** Support now lives under Customers › Support; keep old links working. */
export default async function SupportRedirect({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { order, ticket } = await searchParams;
  const query = new URLSearchParams({ tab: "support" });
  if (typeof order === "string") query.set("order", order);
  if (typeof ticket === "string") query.set("ticket", ticket);
  redirect(`/customers?${query.toString()}`);
}
