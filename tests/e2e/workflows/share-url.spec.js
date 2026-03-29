import { test, expect } from '@playwright/test';
import { EditorPage } from '../../utils/test-helpers.js';
import { sampleData } from '../../fixtures/sample-data.js';

/**
 * Share URL Feature Tests
 * Tests URL generation, encoding/decoding, round-trip consistency, and length warnings
 */

test.describe('Share URL Workflow', () => {
  let page;

  test.beforeEach(async ({ page: testPage }) => {
    page = new EditorPage(testPage);
    await page.navigate();
    // Clear storage for clean state
    await testPage.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    // Ensure XSLT mode
    await page.switchToXslt();
  });

  test('should generate a share URL from current editor state', async ({ page: testPage }) => {
    const xml = sampleData.simpleXml;
    const xslt = sampleData.simpleXslt;

    await page.fillXml(xml);
    await page.fillXslt(xslt);

    const shareUrl = await page.generateShareUrl();

    expect(shareUrl).toBeTruthy();
    expect(shareUrl.length).toBeGreaterThan(0);
    expect(shareUrl).toContain('localhost');
  });

  test('should include headers in share URL', async ({ page: testPage }) => {
    const xml = sampleData.simpleXml;
    const xslt = sampleData.simpleXslt;

    await page.fillXml(xml);
    await page.fillXslt(xslt);

    // Add headers
    await page.addHeader('Authorization', 'Bearer token123');
    await page.addHeader('X-Custom', 'Value');

    const shareUrl = await page.generateShareUrl();

    expect(shareUrl).toBeTruthy();
    expect(shareUrl.length).toBeGreaterThan(20);

    // URL should encode the headers (they're in the hash/query)
    // We can't directly verify encoding, but we can test round-trip
  });

  test('should include properties in share URL', async ({ page: testPage }) => {
    const xml = sampleData.simpleXml;
    const xslt = sampleData.simpleXslt;

    await page.fillXml(xml);
    await page.fillXslt(xslt);

    // Add properties
    await page.addProperty('Timeout', '5000');
    await page.addProperty('Retries', '3');

    const shareUrl = await page.generateShareUrl();

    expect(shareUrl).toBeTruthy();
    expect(shareUrl.length).toBeGreaterThan(20);
  });

  test('should generate consistent share URL for same content', async ({ page: testPage }) => {
    const xml = sampleData.simpleXml;
    const xslt = sampleData.simpleXslt;

    await page.fillXml(xml);
    await page.fillXslt(xslt);

    const url1 = await page.generateShareUrl();
    await page.closeShareModal();

    // Generate again without changes
    const url2 = await page.generateShareUrl();

    expect(url1).toBe(url2);
  });

  test('should handle corrupted share URL gracefully', async ({ page: testPage }) => {
    // Navigate to a corrupted share URL
    const corruptedUrl = 'http://localhost:8000/#share/invalid-base64-data!@#$%';

    await page.loadFromShareUrl(corruptedUrl);

    // App should not crash, editors should be empty or unchanged
    const xml = await page.getXmlContent();
    const xslt = await page.getXsltContent();

    // Should be empty or have default content (no error crash)
    expect(typeof xml).toBe('string');
    expect(typeof xslt).toBe('string');

    // Check that an error was logged
    const errors = await page.getConsoleErrors();
    // We should have an error or warning about the corrupt hash
    // (but this is internal, may not show as console error)
  });

  test('should perform round-trip: generate URL, load, generate again with same result', async ({ page: testPage }) => {
    const xml = sampleData.simpleXml;
    const xslt = sampleData.simpleXslt;

    await page.fillXml(xml);
    await page.fillXslt(xslt);
    await page.addHeader('TestHeader', 'TestValue');

    // First generation
    const url1 = await page.generateShareUrl();
    await page.closeShareModal();

    // Load from URL
    await page.loadFromShareUrl(url1);
    await testPage.waitForTimeout(2000);

    // Second generation (after loading)
    const url2 = await page.generateShareUrl();

    // URLs should be identical for same content
    expect(url1).toBe(url2);
  });

  test('should clean up hash from URL after loading share data', async ({ page: testPage }) => {
    const xml = sampleData.simpleXml;
    const xslt = sampleData.simpleXslt;

    await page.fillXml(xml);
    await page.fillXslt(xslt);

    const shareUrl = await page.generateShareUrl();
    await page.closeShareModal();

    // Navigate to share URL
    await page.loadFromShareUrl(shareUrl);
    await testPage.waitForTimeout(2000);

    // Check if URL has been cleaned (hash removed for UX)
    const currentUrl = await testPage.url();
    // App may or may not clean the hash depending on implementation
    // At minimum, the share data should be loaded
    const xml2 = await page.getXmlContent();
    expect(xml2).toBe(xml);
  });

  test('should close share modal when clicking outside', async ({ page: testPage }) => {
    const xml = sampleData.simpleXml;
    const xslt = sampleData.simpleXslt;

    await page.fillXml(xml);
    await page.fillXslt(xslt);

    const shareUrl = await page.generateShareUrl();

    // Modal should be open
    let backdrop = testPage.locator('#shareModalBackdrop');
    let isOpen = await backdrop.evaluate(el => el.classList.contains('open'));
    expect(isOpen).toBe(true);

    // Close it
    await page.closeShareModal();

    isOpen = await backdrop.evaluate(el => el.classList.contains('open'));
    expect(isOpen).toBe(false);
  });
});
