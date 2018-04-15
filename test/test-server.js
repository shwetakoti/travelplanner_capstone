const chai = require('chai');
const chatHttp = require('chai-http');

const expect = chai.expect();
chai.use(chaiHttp);

const {app} = require('../server');

describe('sample test',function(){

  it('should return a status of 200',function(){
    return chai.request(app).get('/').then(function(res){
      expect(res).to.have.status(201);
      expect(res).to.be.json;
    })
  })
})
