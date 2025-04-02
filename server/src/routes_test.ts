import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { dummy, save, resetForTesting, load, listFiles } from './routes';


describe('routes', function () {

  // After you know what to do, feel free to delete this Dummy test
  it('dummy', function () {
    // Feel free to copy this test structure to start your own tests, but look at these
    // comments first to understand what's going on.

    // httpMocks lets us create mock Request and Response params to pass into our route functions
    const req1 = httpMocks.createRequest(
      // query: is how we add query params. body: {} can be used to test a POST request
      { method: 'GET', url: '/api/dummy', query: { name: 'Kevin' } });
    const res1 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    dummy(req1, res1);

    // check that the request was successful
    assert.strictEqual(res1._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepEqual(res1._getData(), { greeting: 'Hi, Kevin' });
  });


  // TODO: add tests for your routes
  it('save', function () {

    // First branch, straight line code, error case (only one possible input)
    const req1 = httpMocks.createRequest(
      { method: 'POST', url: '/api/save', body: { name: "", json: '{ "myString": "string", "myNumber": 4 }' } });
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);

    assert.deepStrictEqual(res1._getData(),
      'required argument "name" was missing');


    // Second branch, straight line code, error case (only one possible input)
    const req2 = httpMocks.createRequest(
      { method: 'POST', url: '/api/save', body: { name: "A", json: "" } });
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
      'invalid JSON');

    // Third branch, straight line code
    const req3 = httpMocks.createRequest({
      method: 'POST', url: '/api/save',
      body: { name: "hello", json: '{"myString": "string", "myNumber": 4 }' }
    });
    const res3 = httpMocks.createResponse();
    save(req3, res3);

    
    assert.deepStrictEqual(res3._getStatusCode(), 400);

    const req4 = httpMocks.createRequest({
      method: 'POST', url: '/save',
      body: { name: "hello", json: '{"myString": "string", "myNumber": 4 }'}
    });

    const res4 = httpMocks.createResponse();
    save(req4, res4);

    assert.deepEqual(res4._getData(), 'invalid JSON')
    assert.deepStrictEqual(res4._getStatusCode(), 400);

    resetForTesting();

  });

  it('load', function () {

    const req1 = httpMocks.createRequest(
      { method: 'GET', url: '/', query: {} });
    const res1 = httpMocks.createResponse();
    load(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
      'Uh oh, name was not provided');

    const req2 = httpMocks.createRequest(
      { method: 'GET', url: '/', query: { name: "Test1", value: "Test Text" } });
    const res2 = httpMocks.createResponse();
    load(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);

    const req3 = httpMocks.createRequest(
      { method: 'GET', url: '/', query: { name: "Test2", value: "Test Text" } });
    const res3 = httpMocks.createResponse();
    load(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 400);

    const req4 = httpMocks.createRequest({
      method: 'GET', url: '/',
      query: { name: "", value: "Uh oh, name was not provided" }
    });
    const res4 = httpMocks.createResponse();
    load(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(), "Uh oh, name was not provided");

    const req5 = httpMocks.createRequest({
      method: 'GET', url: '/',
      query: { value: "Uh oh, name was not provided" }
    });
    const res5 = httpMocks.createResponse();
    load(req5, res5);

    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(), "Uh oh, name was not provided");

    const req6 = httpMocks.createRequest({
      method: 'POST', url: '/save',
      body: { name: "hello", json: '{"myString": "string", "myNumber": 4 }' }
    });

    const res6 = httpMocks.createResponse();
    save(req6, res6);
    

    resetForTesting();


  });

  it('listFiles', function () {

    const req1 = httpMocks.createRequest({
      method: 'POST',
      url: '/save',
      body: { name: "hello", json: 'invalid JSON' }
  });

  const res1 = httpMocks.createResponse();
  save(req1, res1);

  const req2 = httpMocks.createRequest({
      method: 'GET',
      url: '/listFiles',
  });

  const res2 = httpMocks.createResponse();
  listFiles(req2, res2);

  assert.strictEqual(res2._getStatusCode(), 200);
  assert.strictEqual(res2._getData(), '{"value": []}');

});


});
