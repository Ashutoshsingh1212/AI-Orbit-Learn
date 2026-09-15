const BASE_URL = 'http://localhost:5001/api';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n=========================================');
  console.log('🧪 RUNNING AI TOOLS DIRECTORY QA TESTS');
  console.log('=========================================\n');

  // Test 1: Health check
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data: any = await res.json();
    assert(res.status === 200 && data.status === 'ok', 'GET /api/health returns 200 OK');
  } catch (e: any) {
    assert(false, `GET /api/health failed: ${e.message}`);
  }

  // Test 2: Categories listing & counts
  try {
    const res = await fetch(`${BASE_URL}/categories`);
    const json: any = await res.json();
    assert(res.status === 200, 'GET /api/categories returns 200');
    assert(Array.isArray(json.data.categories), 'Categories array returned');
    assert(json.data.categories.length >= 5, `Contains at least 5 categories (found ${json.data.categories.length})`);
    assert(json.data.totalTools >= 10, `Total tool count reported accurately (${json.data.totalTools})`);
  } catch (e: any) {
    assert(false, `Categories test failed: ${e.message}`);
  }

  // Test 3: Tools listing & pagination
  let firstToolId = '';
  let firstToolSlug = '';
  try {
    const res = await fetch(`${BASE_URL}/tools?page=1&limit=5`);
    const json: any = await res.json();
    assert(res.status === 200, 'GET /api/tools returns 200');
    assert(json.data.length === 5, 'Pagination limit respected (5 items returned)');
    assert(json.pagination.total >= 10, 'Pagination total accurate');
    assert(json.pagination.totalPages >= 2, 'Pagination totalPages calculated properly');
    firstToolId = json.data[0].id;
    firstToolSlug = json.data[0].slug;
  } catch (e: any) {
    assert(false, `Tools pagination test failed: ${e.message}`);
  }

  // Test 4: Search functionality
  try {
    const res = await fetch(`${BASE_URL}/tools?search=cursor`);
    const json: any = await res.json();
    assert(res.status === 200, 'GET /api/tools?search=cursor returns 200');
    assert(json.data.length >= 1, 'Found at least 1 match for "cursor"');
    assert(json.data[0].name.toLowerCase().includes('cursor'), 'Tool name matches search query');
    assert(json.data[0].fullDescription.length > 0, 'Tool fullDescription present');
    assert(json.data[0].icon.length > 0, 'Tool icon present');
    assert(json.data[0].url.length > 0, 'Tool url present');
  } catch (e: any) {
    assert(false, `Search test failed: ${e.message}`);
  }

  // Test 5: Category filtering
  try {
    const res = await fetch(`${BASE_URL}/tools?category=Coding`);
    const json: any = await res.json();
    assert(res.status === 200, 'GET /api/tools?category=Coding returns 200');
    assert(json.data.length > 0, 'Found tools for category "Coding"');
    const allCoding = json.data.every((t: any) => t.category === 'Coding');
    assert(allCoding, 'All returned tools belong to the "Coding" category');
  } catch (e: any) {
    assert(false, `Category filtering test failed: ${e.message}`);
  }

  // Test 6: Tool Detail by ID
  try {
    const res = await fetch(`${BASE_URL}/tools/${firstToolId}`);
    const json: any = await res.json();
    assert(res.status === 200, 'GET /api/tools/:id by ID returns 200');
    assert(json.data.id === firstToolId, 'Returned tool matches ID');
  } catch (e: any) {
    assert(false, `Tool detail by ID test failed: ${e.message}`);
  }

  // Test 7: Tool Detail by Slug
  try {
    const res = await fetch(`${BASE_URL}/tools/${firstToolSlug}`);
    const json: any = await res.json();
    assert(res.status === 200, 'GET /api/tools/:id by Slug returns 200');
    assert(json.data.slug === firstToolSlug, 'Returned tool matches Slug');
    assert(Array.isArray(json.data.features), 'Tool features parsed as array');
  } catch (e: any) {
    assert(false, `Tool detail by Slug test failed: ${e.message}`);
  }

  // Test 8: 404 on invalid tool ID/Slug
  try {
    const res = await fetch(`${BASE_URL}/tools/non-existent-random-tool-12345`);
    const json: any = await res.json();
    assert(res.status === 404, 'GET invalid tool returns HTTP 404');
    assert(json.success === false, 'Returns success: false for missing tool');
  } catch (e: any) {
    assert(false, `Invalid tool test failed: ${e.message}`);
  }

  // Test 9: Related tools
  try {
    const res = await fetch(`${BASE_URL}/tools/${firstToolSlug}/related?limit=3`);
    const json: any = await res.json();
    assert(res.status === 200, 'GET /api/tools/:id/related returns 200');
    assert(Array.isArray(json.data), 'Related tools returns an array');
    assert(json.data.every((t: any) => t.id !== firstToolId), 'Related tools exclude current tool');
  } catch (e: any) {
    assert(false, `Related tools test failed: ${e.message}`);
  }

  // Test 10: Authentication flow
  let token = '';
  try {
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@aiorbit.club', password: 'password123' }),
    });
    const loginData: any = await loginRes.json();
    assert(loginRes.status === 200, 'POST /api/auth/login returns 200');
    assert(Boolean(loginData.token), 'Returns valid JWT token');
    token = loginData.token;
  } catch (e: any) {
    assert(false, `Auth test failed: ${e.message}`);
  }

  // Test 11: Review submission
  try {
    const validRes = await fetch(`${BASE_URL}/tools/cursor/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        rating: 5,
        title: 'Outstanding pair programmer',
        content: 'Cursor has doubled our shipping velocity on full-stack React and Express projects.',
      }),
    });
    const validData: any = await validRes.json();
    assert(validRes.status === 201, 'Valid review submission returns 201 Created');
    assert(validData.data.title === 'Outstanding pair programmer', 'Submitted review persisted');
  } catch (e: any) {
    assert(false, `Review submission test failed: ${e.message}`);
  }

  // Test 12: Bookmarking flow
  try {
    const toggleRes = await fetch(`${BASE_URL}/tools/chatgpt/bookmark`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(toggleRes.status === 200, 'POST /api/tools/:id/bookmark returns 200');

    const bookmarksRes = await fetch(`${BASE_URL}/bookmarks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const bookmarksData: any = await bookmarksRes.json();
    assert(bookmarksRes.status === 200, 'GET /api/bookmarks returns 200');
    assert(Array.isArray(bookmarksData.data), 'User bookmarks returned as array');
  } catch (e: any) {
    assert(false, `Bookmarking test failed: ${e.message}`);
  }

  console.log('\n-----------------------------------------');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('-----------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
