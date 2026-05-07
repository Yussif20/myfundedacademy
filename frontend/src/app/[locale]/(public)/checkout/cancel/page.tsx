import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-6 py-16">
      <Card className="w-full text-center">
        <CardHeader>
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
            <XCircle className="size-7" />
          </div>
          <CardTitle className="mt-3">Checkout canceled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            No charge was made. You can return to the course anytime to complete the purchase.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href="/courses">Browse courses</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/pricing">View plans</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
