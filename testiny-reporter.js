import fetch from 'node-fetch';

// Parse CLI argument for --testRunName
let testRunNameArg = null;
process.argv.forEach((arg) => {
  if (arg.startsWith('--testRunName=')) {
    testRunNameArg = arg.split('=')[1];
  }
});

class TestinyReporter {
  constructor() {
    this.results = [];
    // Use CLI argument first, then environment variable
    this.testRunName = testRunNameArg || process.env.TEST_RUN_NAME || null;
    this.testRunId = null; // Will be set after creating a new test run
  }

  onTestBegin(test) {
    console.log(`Starting test: ${test.title}`);
  }

  onTestEnd(test, result) {
    const testResult = {
      title: test.title,
      status: result.status,
      duration: result.duration,
      errors: result.errors.map(e => e.message),
    };
    this.results.push(testResult);
    console.log(`Finished test: ${test.title} → ${result.status}`);
  }

  async createTestRun() {
    console.log('Creating a new Testiny test run...');
    const payload = {
      projectId: process.env.TESTINY_PROJECT_ID,
      name: this.testRunName,
    };

    try {
      const response = await fetch('https://api.testiny.com/test-runs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.TESTINY_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      this.testRunId = data.id; // Capture the new run ID
      console.log(`Created Testiny test run with ID: ${this.testRunId}`);
    } catch (err) {
      console.error('Failed to create new test run:', err);
      throw err;
    }
  }

  async onEnd() {
    try {
      if (!this.testRunId) {
        await this.createTestRun(); // Ensure we have a test run ID
      }

      console.log('Sending test results to Testiny...');

      const payload = {
        projectId: process.env.TESTINY_PROJECT_ID,
        testRunId: this.testRunId, // use dynamically created ID
        results: this.results,
      };

      const response = await fetch('https://api.testiny.com/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.TESTINY_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('Failed to send results to Testiny:', await response.text());
      } else {
        console.log('Results successfully sent to Testiny!');
      }
    } catch (err) {
      console.error('Error sending results to Testiny:', err);
    }
  }
}

export default TestinyReporter;
