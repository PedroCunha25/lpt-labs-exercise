import { useRef } from "react";
import { Form, useSubmit } from "react-router";
import { ChevronDown } from "lucide-react";

import { Checkbox } from "~/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import type { Category } from "~/types/product";

const VISIBLE_COUNT = 8;

export function CategoryFilter({
  categories,
  selected,
  sort,
  idPrefix = "category",
}: {
  categories: Category[];
  selected: string[];
  sort: string;
  idPrefix?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();
  const visible = categories.slice(0, VISIBLE_COUNT);
  const rest = categories.slice(VISIBLE_COUNT);

  return (
    <Form method="get" ref={formRef} className="space-y-4">
      {sort && <input type="hidden" name="sort" value={sort} />}
      <h2 className="text-sm font-medium text-foreground">Categories</h2>
      <ul className="space-y-3">
        {visible.map((category) => (
          <CategoryItem
            key={category.slug}
            category={category}
            checked={selected.includes(category.slug)}
            onChange={() => submit(formRef.current)}
            idPrefix={idPrefix}
          />
        ))}
      </ul>
      {rest.length > 0 && (
        <Collapsible defaultOpen={rest.some((c) => selected.includes(c.slug))}>
          <CollapsibleTrigger className="group flex items-center gap-1 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none">
            Show all ({categories.length})
            <ChevronDown className="size-4 transition-transform duration-200 ease-out group-data-panel-open:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="mt-3 space-y-3">
              {rest.map((category) => (
                <CategoryItem
                  key={category.slug}
                  category={category}
                  checked={selected.includes(category.slug)}
                  onChange={() => submit(formRef.current)}
                  idPrefix={idPrefix}
                />
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      )}
      <hr className="border-border" />
    </Form>
  );
}

function CategoryItem({
  category,
  checked,
  onChange,
  idPrefix,
}: {
  category: Category;
  checked: boolean;
  onChange: () => void;
  idPrefix: string;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <Checkbox
        id={`${idPrefix}-${category.slug}`}
        name="category"
        value={category.slug}
        checked={checked}
        onCheckedChange={onChange}
        className="mt-0.5"
      />
      <label
        htmlFor={`${idPrefix}-${category.slug}`}
        className="cursor-pointer text-sm leading-tight text-foreground"
      >
        {category.name}
      </label>
    </li>
  );
}
