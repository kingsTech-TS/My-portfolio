import Image from "next/image"
import { cn } from "@/components/lib/utils"
import { PROFILE } from "@/lib/data"

/**
 * Head-and-shoulders crop of /public/profile/me.jpg (1920x2560, portrait).
 * The square crop spans x 22.5%–75.8% and y 22%–62% of the photo, centered on the face.
 * Expressed relative to the container: width = 1 / 0.533 ≈ 188%, offset left -22.5% * 188% ≈ -42%,
 * offset top -22% * 250% (rendered height) = -55%.
 * If you swap the photo, adjust these three numbers.
 */
const CROP = { width: "188%", left: "-42%", top: "-55%" }

export default function Avatar({
  className,
  sizes = "340px",
  priority = false,
}: {
  className?: string
  sizes?: string
  priority?: boolean
}) {
  return (
    <div className={cn("relative aspect-square overflow-hidden rounded-full bg-[#c4844f]", className)}>
      <Image
        src={PROFILE.avatar}
        alt={PROFILE.name}
        width={1920}
        height={2560}
        sizes={sizes}
        priority={priority}
        style={{ position: "absolute", maxWidth: "none", height: "auto", ...CROP }}
      />
    </div>
  )
}
