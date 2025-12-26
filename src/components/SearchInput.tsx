"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchInput({ placeholder, queryParam = "search" }: { placeholder: string, queryParam?: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", "1");
        if (term) {
            params.set(queryParam, term);
        } else {
            params.delete(queryParam);
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            <Input
                className="pl-10 peer block w-full rounded-md border border-gray-200 py-[9px] text-sm outline-2 placeholder:text-gray-500"
                placeholder={placeholder}
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get(queryParam)?.toString()}
            />
            <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
    );
}
