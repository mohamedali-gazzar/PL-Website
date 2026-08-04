import CollectionView from "@/components/CollectionView";
import { primarySwitchgear } from "@/lib/content";

export const metadata = {
  title: "Primary Switchgear — Powerline",
  description: primarySwitchgear.intro,
};

export default function Page() {
  return (
    <CollectionView
      data={primarySwitchgear}
      eyebrow="Our Products"
      img="/img/prod-mcset.webp"
    />
  );
}
