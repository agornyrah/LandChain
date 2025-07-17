"use strict";
const { Contract } = require('fabric-contract-api');

class LandRegistryContract extends Contract {
  async InitLedger(ctx) {
    // Optionally seed with demo data
    const properties = [];
    for (const prop of properties) {
      await ctx.stub.putState(prop.propertyId, Buffer.from(JSON.stringify(prop)));
    }
  }

  async RegisterLand(ctx, propertyId, ownerId, address, size, type) {
    const exists = await this.PropertyExists(ctx, propertyId);
    if (exists) throw new Error(`Property ${propertyId} already exists`);
    const property = {
      propertyId,
      ownerId,
      address,
      size,
      type,
      status: 'pending_verification',
      ownershipHistory: [],
    };
    await ctx.stub.putState(propertyId, Buffer.from(JSON.stringify(property)));
    return JSON.stringify(property);
  }

  async RegisterUser(ctx, username, publicKey, role, email, firstName, lastName, address, phone, passwordHash) {
    const userKey = ctx.stub.createCompositeKey('User', [username]);
    const exists = await this.UserExists(ctx, username);
    if (exists) throw new Error(`User ${username} already exists`);
    const user = {
      username, publicKey, role, email, profile: { firstName, lastName, address, phone }, passwordHash,
      createdAt: new Date().toISOString()
    };
    await ctx.stub.putState(userKey, Buffer.from(JSON.stringify(user)));
    return JSON.stringify(user);
  }

  async GetUser(ctx, username) {
    const userKey = ctx.stub.createCompositeKey('User', [username]);
    const userBytes = await ctx.stub.getState(userKey);
    if (!userBytes || userBytes.length === 0) throw new Error(`User ${username} not found`);
    return userBytes.toString();
  }

  async UserExists(ctx, username) {
    const userKey = ctx.stub.createCompositeKey('User', [username]);
    const userBytes = await ctx.stub.getState(userKey);
    return !!userBytes && userBytes.length > 0;
  }

  async SetUserRole(ctx, username, newRole) {
    const user = JSON.parse(await this.GetUser(ctx, username));
    user.role = newRole;
    const userKey = ctx.stub.createCompositeKey('User', [username]);
    await ctx.stub.putState(userKey, Buffer.from(JSON.stringify(user)));
    return JSON.stringify(user);
  }

  async GenerateCertificate(ctx, propertyId) {
    const property = await this.ReadProperty(ctx, propertyId);
    if (property.status !== 'registered') throw new Error('Property not registered');
    const cert = {
      propertyId,
      ownerId: property.ownerId,
      issuedAt: new Date().toISOString(),
      issuer: 'LandChain',
      hash: this._sha256(JSON.stringify(property)),
    };
    const certKey = ctx.stub.createCompositeKey('Certificate', [propertyId]);
    await ctx.stub.putState(certKey, Buffer.from(JSON.stringify(cert)));
    return JSON.stringify(cert);
  }

  async GetCertificate(ctx, propertyId) {
    const certKey = ctx.stub.createCompositeKey('Certificate', [propertyId]);
    const certBytes = await ctx.stub.getState(certKey);
    if (!certBytes || certBytes.length === 0) throw new Error('Certificate not found');
    return certBytes.toString();
  }

  _sha256(str) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(str).digest('hex');
  }

  async ApproveLand(ctx, propertyId, commissionerId) {
    const user = JSON.parse(await this.GetUser(ctx, commissionerId));
    if (user.role !== 'commissioner') throw new Error('Only commissioners can approve land');
    const property = await this.ReadProperty(ctx, propertyId);
    property.status = 'registered';
    property.commissionerId = commissionerId;
    await ctx.stub.putState(propertyId, Buffer.from(JSON.stringify(property)));
    return JSON.stringify(property);
  }

  async TransferLand(ctx, propertyId, fromUserId, toUserId) {
    const fromUser = JSON.parse(await this.GetUser(ctx, fromUserId));
    if (fromUser.role !== 'user') throw new Error('Only users can transfer land');
    const property = await this.ReadProperty(ctx, propertyId);
    if (property.ownerId !== fromUserId) throw new Error('Not current owner');
    property.ownershipHistory.push({ ownerId: fromUserId, toUserId, timestamp: new Date().toISOString() });
    property.ownerId = toUserId;
    await ctx.stub.putState(propertyId, Buffer.from(JSON.stringify(property)));
    return JSON.stringify(property);
  }

  async GetAllProperties(ctx) {
    const results = [];
    const iterator = await ctx.stub.getStateByRange('', '');
    for await (const res of iterator) {
      results.push(JSON.parse(res.value.toString()));
    }
    return JSON.stringify(results);
  }

  async GetPropertyHistory(ctx, propertyId) {
    const property = await this.ReadProperty(ctx, propertyId);
    return JSON.stringify(property.ownershipHistory || []);
  }

  async ReadProperty(ctx, propertyId) {
    const data = await ctx.stub.getState(propertyId);
    if (!data || data.length === 0) throw new Error(`Property ${propertyId} does not exist`);
    return JSON.parse(data.toString());
  }

  async PropertyExists(ctx, propertyId) {
    const data = await ctx.stub.getState(propertyId);
    return (!!data && data.length > 0);
  }
}

module.exports = LandRegistryContract; 