import { describe, expect, it, beforeEach } from "vitest";
import {
  filterPropertiesByFavoriteIds,
  isFavoriteId,
  parseShowFavoritesOnly,
  readFavoriteIdsFromStorage,
  toggleFavoriteId,
  writeFavoriteIdsToStorage,
} from "@/lib/favorites";
import { FAVORITES_STORAGE_KEY } from "@/schemas/favorites-schema";

describe("toggleFavoriteId", () => {
  it("ajoute un id absent", () => {
    expect(toggleFavoriteId([], "abc")).toEqual(["abc"]);
  });

  it("retire un id présent", () => {
    expect(toggleFavoriteId(["abc", "def"], "abc")).toEqual(["def"]);
  });

  it("ne duplique pas un id déjà favori", () => {
    expect(toggleFavoriteId(["abc"], "abc")).toEqual([]);
  });
});

describe("isFavoriteId", () => {
  it("détecte la présence / absence", () => {
    expect(isFavoriteId(["a", "b"], "a")).toBe(true);
    expect(isFavoriteId(["a", "b"], "c")).toBe(false);
  });
});

describe("parseShowFavoritesOnly", () => {
  it("n’accepte que favoris=1", () => {
    expect(parseShowFavoritesOnly("1")).toBe(true);
    expect(parseShowFavoritesOnly(["1"])).toBe(true);
  });

  it("ignore les valeurs malveillantes ou ambiguës", () => {
    expect(parseShowFavoritesOnly(undefined)).toBe(false);
    expect(parseShowFavoritesOnly("true")).toBe(false);
    expect(parseShowFavoritesOnly("yes")).toBe(false);
    expect(parseShowFavoritesOnly("abc,def")).toBe(false);
    expect(parseShowFavoritesOnly(["abc", "def"])).toBe(false);
    expect(parseShowFavoritesOnly("0")).toBe(false);
  });
});

describe("filterPropertiesByFavoriteIds", () => {
  const properties = [
    { id: "a", title: "A" },
    { id: "b", title: "B" },
    { id: "c", title: "C" },
  ];

  it("filtre sur les ids du store, pas sur l’URL", () => {
    expect(filterPropertiesByFavoriteIds(properties, ["c", "a"])).toEqual([
      { id: "a", title: "A" },
      { id: "c", title: "C" },
    ]);
  });

  it("renvoie une liste vide si aucun favori", () => {
    expect(filterPropertiesByFavoriteIds(properties, [])).toEqual([]);
  });
});

describe("localStorage favoris", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persiste et relit les ids", () => {
    writeFavoriteIdsToStorage(["one", "two"]);
    expect(localStorage.getItem(FAVORITES_STORAGE_KEY)).toBe(
      JSON.stringify(["one", "two"]),
    );
    expect(readFavoriteIdsFromStorage()).toEqual(["one", "two"]);
  });

  it("supprime la clé si la liste est vide", () => {
    writeFavoriteIdsToStorage(["one"]);
    writeFavoriteIdsToStorage([]);
    expect(localStorage.getItem(FAVORITES_STORAGE_KEY)).toBeNull();
    expect(readFavoriteIdsFromStorage()).toEqual([]);
  });

  it("ignore un JSON invalide", () => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, "{not-json");
    expect(readFavoriteIdsFromStorage()).toEqual([]);
  });
});
