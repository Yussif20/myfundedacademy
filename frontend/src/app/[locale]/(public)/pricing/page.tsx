import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function PricingPage() {
  const t = useTranslations("pricingPage");
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="font-display text-4xl font-bold tracking-tight">Pricing</h1>
      <p className="mt-3 text-[var(--muted-foreground)]">{t("comingSoon")}</p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { name: "Free", price: "$0", desc: "Free preview lessons + browse catalog" },
          { name: "Starter", price: "$29/mo", desc: "Selected catalog. No certificates." },
          { name: "Pro", price: "$79/mo", desc: "Full catalog + certificates + downloads" },
        ].map((plan) => (
          <Card key={plan.name} className="text-left">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-bold">{plan.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
