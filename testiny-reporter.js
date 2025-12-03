import fetch from 'node-fetch';

class TestinyReporter {
  constructor() {
    this.results = [];
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
