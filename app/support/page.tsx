import SupportClient from "./support-client";

export default async function SupportPage() {
  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Support</h1>
      <p className="text-sm text-zinc-600">
        Send a message to support. Email optional.
      </p>
      <SupportClient />
    </div>
  );
}
