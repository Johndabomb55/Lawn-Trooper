import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <SiteHeader />
      <div className="flex items-center justify-center py-14">
        <Card className="mx-4 w-full max-w-md">
          <CardContent className="pt-6">
            <div className="mb-4 flex gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
            </div>

            <p className="mt-4 text-sm text-gray-600">Did you forget to add the page to the router?</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
