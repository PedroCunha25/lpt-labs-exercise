import { useNavigate } from "react-router";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { SORT_OPTIONS } from "~/lib/product-search-params";

export function SortSelect({
  sort,
  categories,
}: {
  sort: string;
  categories: string[];
}) {
  const navigate = useNavigate();

  return (
    <Select
      value={sort}
      onValueChange={(value) => {
        const params = new URLSearchParams();
        for (const slug of categories) {
          params.append("category", slug);
        }
        if (typeof value === "string" && value) {
          params.set("sort", value);
        }
        navigate(params.size > 0 ? `/?${params}` : "/");
      }}
    >
      <SelectTrigger size="sm" className="w-50">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
