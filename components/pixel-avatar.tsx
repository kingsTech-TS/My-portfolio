import Image from "next/image";

export default function AvatarImage() {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="/Me.jpg"
        alt="Nnabugwu Solomon"
        width={400}
        height={400}
        className="rounded-lg w-full h-auto object-cover"
        priority
      />
    </div>
  );
}
