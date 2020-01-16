/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class HelloworldContract extends Contract {

    async helloworldExists(ctx, helloworldId) {
        const buffer = await ctx.stub.getState(helloworldId);
        return (!!buffer && buffer.length > 0);
    }

    async createHelloworld(ctx, helloworldId, value) {
        const exists = await this.helloworldExists(ctx, helloworldId);
        if (exists) {
            throw new Error(`The helloworld ${helloworldId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(helloworldId, buffer);
    }

    async readHelloworld(ctx, helloworldId) {
        const exists = await this.helloworldExists(ctx, helloworldId);
        if (!exists) {
            throw new Error(`The helloworld ${helloworldId} does not exist`);
        }
        const buffer = await ctx.stub.getState(helloworldId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateHelloworld(ctx, helloworldId, newValue) {
        const exists = await this.helloworldExists(ctx, helloworldId);
        if (!exists) {
            throw new Error(`The helloworld ${helloworldId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(helloworldId, buffer);
    }

    async deleteHelloworld(ctx, helloworldId) {
        const exists = await this.helloworldExists(ctx, helloworldId);
        if (!exists) {
            throw new Error(`The helloworld ${helloworldId} does not exist`);
        }
        await ctx.stub.deleteState(helloworldId);
    }

}

module.exports = HelloworldContract;
