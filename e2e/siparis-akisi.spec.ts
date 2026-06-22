import { test, expect } from "@playwright/test";

test("ana sayfa ürün listesini gösterir", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Tüm Ürünler" })).toBeVisible();
  const urunKartlari = page.locator("text=Sepete Ekle");
  await expect(urunKartlari.first()).toBeVisible();
});

test("ürünü sepete ekleyip sepet sayfasında görme", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Sepete Ekle" }).first().click();

  await page.getByLabel("Sepet").click();
  await expect(page).toHaveURL("/cart");
  await expect(page.getByRole("heading", { name: "Sepetim" })).toBeVisible();
});

test("ürün detay sayfası renk ve boyut seçimini gösterir", async ({ page }) => {
  await page.goto("/products/urun-1");
  await expect(page.getByRole("heading", { name: "Renk" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Boyut" })).toBeVisible();
});

test("girişsiz checkout sign-in modalını açar", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Sepete Ekle" }).first().click();
  await page.getByLabel("Sepet").click();
  await page.getByRole("button", { name: "Sipariş Oluştur" }).click();
  await expect(page.getByText("Sipariş Vermek İçin Giriş Yapın")).toBeVisible();
});
