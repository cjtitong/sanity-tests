import fetch from 'node-fetch';

let testRunNameArg = null;
process.argv.forEach(arg => {
  if (arg.startsWith('--testRunName=')) {
    testRunNameArg = arg.split('=')[1];
  }
});

class TestinyReporter {
  constructor() {
    this.results = [];

    this.testRunName = testRunNameArg || process.env.TEST_RUN_NAME;
    if (!this.testRunName) {
      throw new Error('Test run name is required. Pass via --testRunName or TEST_RUN_NAME env variable.');
    }

    if (!process.env.TESTINY_API_KEY || !process.env.TESTINY_PROJECT_ID) {
      throw new Error('Missing TESTINY_API_KEY or TESTINY_PROJECT_ID environment variable.');
    }

    this.testRunId = null;
  }

  async initializeTestRun() {
    console.log('Creating a new Testiny test run...');
    const payload = {
      projectId: process.env.TESTINY_PROJECT_ID,
      name: this.testRunName,
    };

    const response = await fetch('https://api.testiny.com/test-runs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TESTINY_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to create Testiny run: ${await response.text()}`);
    }

    const data = await response.json();
    this.testRunId = data.id;
    console.log(`Created Testiny test run with ID: ${this.testRunId}`);
  }

  async onTestBegin(test) {
    
    if (!this.testRunId) {
      await this.initializeTestRun();
    }
    console.log(`Starting test: ${test.title}`);
  }

  onTestEnd(test, result) {
    this.results.push({
      title: test.title,
      status: result.status,
      duration: result.duration,
      errors: result.errors.map(e => e.message),
    });
    console.log(`Finished test: ${test.title} → ${result.status}`);
  }

  async onEnd() {
    if (!this.testRunId) {
      await this.initializeTestRun();
    }

    console.log('Uploading test results to Testiny...');
    const payload = {
      projectId: process.env.TESTINY_PROJECT_ID,
      testRunId: this.testRunId,
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
      console.error('Failed to send results:', await response.text());
    } else {
      console.log('Results successfully sent to Testiny!');
    }
  }
}

export default TestinyReporter;
