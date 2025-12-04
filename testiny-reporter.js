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

  async onEnd() {
    console.log('All tests finished. Sending results to Testiny...');

    const payload = {
      projectId: process.env.TESTINY_PROJECT_ID,
      testRunId: process.env.TESTINY_TEST_RUN_ID,
      testRunName: this.testRunName, // will now use CLI argument if provided
      results: this.results,
    };

    try {
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
