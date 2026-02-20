import { test, expect } from "@playwright/test";

test("home loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Perfect fit, instantly.")).toBeVisible();
});