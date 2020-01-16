/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { HelloworldContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('HelloworldContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new HelloworldContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"helloworld 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"helloworld 1002 value"}'));
    });

    describe('#helloworldExists', () => {

        it('should return true for a helloworld', async () => {
            await contract.helloworldExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a helloworld that does not exist', async () => {
            await contract.helloworldExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createHelloworld', () => {

        it('should create a helloworld', async () => {
            await contract.createHelloworld(ctx, '1003', 'helloworld 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"helloworld 1003 value"}'));
        });

        it('should throw an error for a helloworld that already exists', async () => {
            await contract.createHelloworld(ctx, '1001', 'myvalue').should.be.rejectedWith(/The helloworld 1001 already exists/);
        });

    });

    describe('#readHelloworld', () => {

        it('should return a helloworld', async () => {
            await contract.readHelloworld(ctx, '1001').should.eventually.deep.equal({ value: 'helloworld 1001 value' });
        });

        it('should throw an error for a helloworld that does not exist', async () => {
            await contract.readHelloworld(ctx, '1003').should.be.rejectedWith(/The helloworld 1003 does not exist/);
        });

    });

    describe('#updateHelloworld', () => {

        it('should update a helloworld', async () => {
            await contract.updateHelloworld(ctx, '1001', 'helloworld 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"helloworld 1001 new value"}'));
        });

        it('should throw an error for a helloworld that does not exist', async () => {
            await contract.updateHelloworld(ctx, '1003', 'helloworld 1003 new value').should.be.rejectedWith(/The helloworld 1003 does not exist/);
        });

    });

    describe('#deleteHelloworld', () => {

        it('should delete a helloworld', async () => {
            await contract.deleteHelloworld(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a helloworld that does not exist', async () => {
            await contract.deleteHelloworld(ctx, '1003').should.be.rejectedWith(/The helloworld 1003 does not exist/);
        });

    });

});