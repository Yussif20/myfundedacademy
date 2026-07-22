import { HomeThemeLab } from "@/components/theme-lab/home-theme-lab";

/**
 * Home renders through the theme lab: six candidate visual identities plus the
 * current design, switchable via ?variant=<key> (floating bottom bar) so the
 * business owner can compare them on the deployed site.
 */
export default function HomePage() {
  return <HomeThemeLab />;
}
