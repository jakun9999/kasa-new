import Image from "next/image";
import { fetchServer } from "@/lib/api-server";
import { propertiesSchema } from "@/schemas/property";
import { MessageIcon } from "@/components/icons/MessageIcon";
import { Button } from "@/components/ui/Button";

const colors = ["red", "orange", "gray"] as const;

export default async function Home() {
  const response = await fetchServer("/api/properties", { auth: false });
  if (!response.ok) {
    return <div>Error: {response.statusText}</div>;
  }
  const responseData = await response.json();
  const properties = propertiesSchema.parse(responseData);
  console.log(properties);
  return (
    <div className="flex flex-col gap-8 p-8">
      <Image
        src="/logos/kasa_logo_name.svg"
        alt="Kasa"
        width={163}
        height={58}
        priority
      />
      <h1 className="text-h1 font-bold">Hello World</h1>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {colors.map((color) => (
            <Button key={color} size="long" color={color} icon={<MessageIcon />}>
              label
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {colors.map((color) => (
            <Button key={color} size="medium" color={color} icon={<MessageIcon />}>
              label
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {colors.map((color) => (
            <Button
              key={color}
              size="short"
              color={color}
              icon={<MessageIcon />}
              aria-label="Message"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
