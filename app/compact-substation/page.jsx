import CollectionView from "@/components/CollectionView";
import { compactSubstation } from "@/lib/content";

export const metadata = {
  title: "Compact Substation PCSS — Powerline",
  description: compactSubstation.intro,
};

export default function Page() {
  return (
    <CollectionView
      data={compactSubstation}
      eyebrow="Our Products"
      img="/img/prod-pcss.webp"
    />
  );
}
