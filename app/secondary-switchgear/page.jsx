import CollectionView from "@/components/CollectionView";
import { secondarySwitchgear } from "@/lib/content";

export const metadata = {
  title: "Secondary Switchgear — Powerline",
  description: secondarySwitchgear.intro,
};

export default function Page() {
  return (
    <CollectionView
      data={secondarySwitchgear}
      eyebrow="Our Products"
      img="/img/line-mv.webp"
    />
  );
}
