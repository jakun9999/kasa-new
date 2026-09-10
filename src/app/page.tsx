import Image from "next/image";
import { fetchServer } from "@/lib/api-server";
import { propertiesSchema } from "@/schemas/property";

export default async function Home() {
  const response = await fetchServer("/api/properties", { auth: false });
  if (!response.ok) {
    return <div>Error: {response.statusText}</div>;
  }
  const responseData = await response.json();
  const properties = propertiesSchema.parse(responseData);
  console.log(properties);
  return (
    <div className="p-8">
      <Image
        src="/logos/kasa_logo_name.svg"
        alt="Kasa"
        width={163}
        height={58}
        priority
      />
      <h1 className="mt-6 text-h1 font-bold">Hello World</h1>
    </div>
  );
}
