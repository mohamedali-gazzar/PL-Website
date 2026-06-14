import CollectionView from "@/components/CollectionView";
import { lowVoltage } from "@/lib/content";

export const metadata = {
  title: "Low Voltage Assembly — Powerline",
  description: lowVoltage.intro,
};

export default function Page() {
  return (
    <CollectionView
      data={lowVoltage}
      eyebrow="Assembly Lines"
      img="/img/line-lv.jpg"
      highlight={lowVoltage.highlight}
    />
  );
}
