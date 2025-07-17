/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class PropertyTransfer extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const transfers = [
            {
                propertyId: 'LAND0',
                fromUser: 'Tomoko',
                toUser: 'Brad',
                status: 'completed',
            },
        ];

        for (let i = 0; i < transfers.length; i++) {
            transfers[i].docType = 'transfer';
            await ctx.stub.putState('TRANSFER' + i, Buffer.from(JSON.stringify(transfers[i])));
            console.info('Added <--> ', transfers[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryTransfer(ctx, transferNumber) {
        const transferAsBytes = await ctx.stub.getState(transferNumber); // get the transfer from chaincode state
        if (!transferAsBytes || transferAsBytes.length === 0) {
            throw new Error(`${transferNumber} does not exist`);
        }
        console.log(transferAsBytes.toString());
        return transferAsBytes.toString();
    }

    async createTransfer(ctx, transferNumber, propertyId, fromUser, toUser) {
        console.info('============= START : Create Transfer ===========');

        const transfer = {
            docType: 'transfer',
            propertyId,
            fromUser,
            toUser,
            status: 'pending',
        };

        await ctx.stub.putState(transferNumber, Buffer.from(JSON.stringify(transfer)));
        console.info('============= END : Create Transfer ===========');
    }

    async queryAllTransfers(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async updateTransferStatus(ctx, transferNumber, newStatus) {
        console.info('============= START : updateTransferStatus ===========');

        const transferAsBytes = await ctx.stub.getState(transferNumber); // get the transfer from chaincode state
        if (!transferAsBytes || transferAsBytes.length === 0) {
            throw new Error(`${transferNumber} does not exist`);
        }
        const transfer = JSON.parse(transferAsBytes.toString());
        transfer.status = newStatus;

        await ctx.stub.putState(transferNumber, Buffer.from(JSON.stringify(transfer)));
        console.info('============= END : updateTransferStatus ===========');
    }

}

module.exports = PropertyTransfer;