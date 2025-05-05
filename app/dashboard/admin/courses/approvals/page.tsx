"use client";

import { Construction } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnderDevelopmentPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <Construction className="h-16 w-16 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight">Under Development</h1>
        
        <p className="text-lg text-gray-300">
          This feature is currently being built. Please check back soon!
        </p>
        
        <div className="pt-6">
          <Link href="/dashboard/admin">
            <Button 
              variant="outline" 
              className="bg-transparent text-white border-white hover:bg-white hover:text-black transition-colors"
            >
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}