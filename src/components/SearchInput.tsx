"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export function SearchInput({ placeholder = "Search..." }: { placeholder?: string }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [term, setTerm] = useState(searchParams.get('q')?.toString() || "");

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        router.replace(`?${params.toString()}`);
    };

    return (
        <div className="flex w-full md:w-auto items-center gap-2">
            <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder={placeholder}
                    className="pl-8 w-full"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                />
            </div>
            <Button onClick={handleSearch}>Cari</Button>
        </div>
    );
}
