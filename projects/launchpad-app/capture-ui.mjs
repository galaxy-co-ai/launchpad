import { chromium } from 'playwright';

(async () => {
  console.log('🎭 Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Capture console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location(),
    });
  });

  // Capture errors
  const errors = [];
  page.on('pageerror', error => {
    errors.push({
      message: error.message,
      stack: error.stack,
    });
  });

  try {
    console.log('📍 Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });

    console.log('📸 Taking screenshot...');
    await page.screenshot({ path: 'screenshot.png', fullPage: true });

    console.log('\n✅ Screenshot saved to screenshot.png\n');

    // Print console messages
    console.log('📋 CONSOLE MESSAGES:');
    console.log('═══════════════════════════════════════════════════════════════');
    if (consoleMessages.length === 0) {
      console.log('  No console messages');
    } else {
      consoleMessages.forEach((msg, i) => {
        console.log(`\n[${i + 1}] ${msg.type.toUpperCase()}`);
        console.log(`  ${msg.text}`);
        if (msg.location?.url) {
          console.log(`  at ${msg.location.url}:${msg.location.lineNumber}:${msg.location.columnNumber}`);
        }
      });
    }

    // Print errors
    console.log('\n\n❌ ERRORS:');
    console.log('═══════════════════════════════════════════════════════════════');
    if (errors.length === 0) {
      console.log('  No errors! 🎉');
    } else {
      errors.forEach((error, i) => {
        console.log(`\n[${i + 1}] ${error.message}`);
        console.log(error.stack);
      });
    }

    // Get page title and URL
    const title = await page.title();
    const url = page.url();
    console.log('\n\n📄 PAGE INFO:');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`  Title: ${title}`);
    console.log(`  URL: ${url}`);

    // Check for TypeErrors specifically
    const typeErrors = errors.filter(e => e.message.includes('TypeError'));
    if (typeErrors.length > 0) {
      console.log('\n\n🔴 TYPE ERRORS FOUND:');
      console.log('═══════════════════════════════════════════════════════════════');
      typeErrors.forEach((error, i) => {
        console.log(`\n[${i + 1}] ${error.message}`);
        console.log(error.stack);
      });
    }

  } catch (error) {
    console.error('\n❌ Failed to capture:', error.message);
  } finally {
    await browser.close();
    console.log('\n✅ Browser closed');
  }
})();

