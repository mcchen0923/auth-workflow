const chai = require("fix-esm").require('chai')
const expect = chai.expect
const supertest = require('supertest')
const app = require('../app')
const add = require('../controllers/fortest')

const api = supertest('http://localhost:3000')



describe('apitest',(done) =>{
    it('API get',(done) =>{
        api.get('/')
        .expect(200, done)
    })
})
