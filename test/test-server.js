const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect();
chai.use(chaiHttp);

const {app} = require('../server');

describe('server',function(){
  it('should return a status of 200',function(){
    return chai.request(app).get('/').then(function(res){
      expect(res).to.have.status(200);
    //  expect(res).to.be.html;
  });
 });
});
