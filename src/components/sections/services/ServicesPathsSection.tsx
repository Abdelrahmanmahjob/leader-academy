import { getTranslations } from "next-intl/server";
import { OurPathsSection } from "@/components/sections/home/OurPathsSection";

export async function ServicesPathsSection() {
  const t = await getTranslations("home.servicesPage");
  return <OurPathsSection titleOverride={t("pathsTitle")} />;
}
