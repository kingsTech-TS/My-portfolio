export default function AvatarImage() {
  return (
    <div className="flex flex-col items-center gap-4">
      <img
        src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortFlat&accessoriesType=Blank&hairColor=Black&facialHairType=BeardLight&clotheType=Hoodie&clotheColor=Blue03&eyeType=Happy&eyebrowType=Default&mouthType=Smile&skinColor=Light"
        alt="Avatar"
        width={400}
        height={400}
      />

        {/* <img
        src="/profile/me.jpg" 
        alt="Profile"
        className="rounded-lg w-full h-full object-cover"
      /> */}
    </div>
  );
}
