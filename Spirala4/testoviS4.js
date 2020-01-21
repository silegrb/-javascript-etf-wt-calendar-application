const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
let assert = chai.assert;
const { expect } = chai;
chai.use(chaiHttp);
describe('Testiranje Spirale 4', function() {
	describe('obojiZauzeca()', function() {
		it("test",done =>{
			chai
			.request(app).get("/osoblje").expect(200).end(function(error,res){
				assert.true(res.body.length,3);
				done();
			});
		});
		
	});
});

