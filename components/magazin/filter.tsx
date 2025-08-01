"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Author, Category, Tag } from "@/lib/wordpress";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterPostsProps {
  tags: Tag[];
  categories: Category[];
  authors: Author[];
  selectedTag?: string;
  selectedAuthor?: string;
  selectedCategory?: string;
}

export function MagazineStickyFilter({
  authors,
  tags,
  categories,
  selectedAuthor,
  selectedTag,
  selectedCategory,
}: FilterPostsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  const handleFilterChange = (type: string, value: string) => {
    console.log(`Filter changed: ${type} -> ${value}`);
    const newParams = new URLSearchParams(window.location.search);
    newParams.delete("page");
    value === "all" ? newParams.delete(type) : newParams.set(type, value);

    router.push(`/magazin?${newParams.toString()}`);
  };

  const handleReset = () => {
    setSearchTerm("");
    router.push(pathname);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleFilterChange("search", searchTerm);
  };

  const hasTags = tags.length > 0;
  const hasCategories = categories.length > 0;
  const hasAuthors = authors.length > 0;

  return (
    <div className="sticky top-0 z-10 bg-white/80 dark:bg-background/80 backdrop-blur-md border-b mb-8 py-4">
      <form onSubmit={handleSearchSubmit} className="container mx-auto flex flex-wrap items-center justify-center gap-4">
        <Select
          value={selectedTag || "all"}
          onValueChange={(value) => handleFilterChange("tag", value)}
        >
          <SelectTrigger disabled={!hasTags}>
            {hasTags ? <SelectValue placeholder="Alle Schlagwörter" /> : "Keine Schlagwörter gefunden"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Schlagwörter</SelectItem>
            {tags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id.toString()}>
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedCategory || "all"}
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger disabled={!hasCategories}>
            {hasCategories ? (
              <SelectValue placeholder="Alle Kategorien" />
            ) : (
              "Keine Kategorien gefunden"
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Kategorien</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedAuthor || "all"}
          onValueChange={(value) => handleFilterChange("author", value)}
        >
          <SelectTrigger disabled={!hasAuthors} className="text-center">
            {hasAuthors ? (
              <SelectValue placeholder="Alle Autoren" />
            ) : (
              "Keine Autoren gefunden"
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Autoren</SelectItem>
            {authors.map((author) => (
              <SelectItem key={author.id} value={author.id.toString()}>
                {author.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="search"
          placeholder="Artikel suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Button type="submit">Suchen</Button>
        <Button variant="outline" onClick={handleReset} className="whitespace-nowrap">
          Filter zurücksetzen
        </Button>
      </form>
    </div>
  );
}
