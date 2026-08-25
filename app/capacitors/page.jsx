import CollectionView from "@/components/CollectionView";
import { capacitors } from "@/lib/content";

export const metadata = {
  title: "Capacitors — Powerline",
  description: capacitors.intro,
};

export default function Page() {
  return (
    <CollectionView
      data={capacitors}
      eyebrow="Our Products"
      img="/img/prod-capacitor.webp"
    />
  );
}
