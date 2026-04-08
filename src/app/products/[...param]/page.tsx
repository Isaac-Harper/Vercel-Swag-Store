export default async function ProductPage({
  params,
}: {
  params: Promise<{ param: string[] }>;
}) {
  const { param } = await params;

  return (
    <div>
      <h1>Product Page</h1>
      <p>Params: {param.join(" / ")}</p>
    </div>
  );
}
